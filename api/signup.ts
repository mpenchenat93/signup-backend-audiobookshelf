import { createClient } from '@supabase/supabase-js'

const BASE_URL = process.env.BASE_URL;

const HOST_CLIENT_URL = process.env.HOST_CLIENT_URL;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const LOGIN_URL = `${BASE_URL}/login`;
const CREATE_USER_URL = `${BASE_URL}/api/users`;
const LOGOUT_URL = `${BASE_URL}/logout`;

const LOGIN_CREDENTIALS = {
  username: process.env.LOGIN_USERNAME,
  password: process.env.LOGIN_PASSWORD,
};

export function applyCORS(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", HOST_CLIENT_URL);
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.status(200).end();
    return true;
  }

  res.setHeader("Access-Control-Allow-Origin", HOST_CLIENT_URL);
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return false;
}

async function verifyCaptcha(token: string) {
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET_KEY,
        response: token,
      }).toString(),
    }
  );

  const data = await response.json();
  return data.success && data.score > 0.5; // Ajustez le seuil selon vos besoins
}

async function performLogin() {
  const response = await fetch(LOGIN_URL, {
    headers: { "content-type": "application/json" },
    body: JSON.stringify(LOGIN_CREDENTIALS),
    method: "POST",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Login failed: ${errorText}`);
  }

  const data = await response.json();
  const token = data?.user?.token;

  if (!token) {
    throw new Error("No token received from login");
  }

  return token;
}

async function createUser(token, { email, name, password, phone }) {
  // First, store user data in Supabase
  const { data: supabaseUser, error: supabaseError } = await supabase
    .from('users')
    .insert([
      { 
        name,
        email,
        phone,
        created_at: new Date().toISOString()
      }
    ])
    .select()
    .single()

  if (supabaseError) {
    throw new Error(`Failed to store user in Supabase: ${supabaseError.message}`);
  }

  // Then proceed with Audiobookshelf user creation
  const userBody = {
    username: name,
    email: email,
    password: password,
    type: "user",
    isActive: true,
    permissions: {
      download: true,
      update: false,
      delete: false,
      upload: false,
      accessExplicitContent: false,
      accessAllLibraries: true,
      accessAllTags: true,
      selectedTagsNotAccessible: false,
      createEreader: false,
    },
  };

  const response = await fetch(CREATE_USER_URL, {
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userBody),
    method: "POST",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`User creation failed: ${errorText}`);
  }

  return response.status;
}

async function logout(token) {
  const response = await fetch(LOGOUT_URL, {
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Logout failed: ${errorText}`);
  }

  return response.status;
}

export default async function handler(req, res) {
  if (applyCORS(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, name, password, phone, captchaToken } = req.body;

  try {
    // Vérification du captcha
    const captchaValid = await verifyCaptcha(captchaToken);
    if (!captchaValid) {
      return res.status(400).json({ error: "Captcha verification failed" });
    }

    // Login, création utilisateur et logout.
    const token = await performLogin();
    const userStatus = await createUser(token, { email, name, password, phone });
    const logoutStatus = await logout(token);

    return res.status(200).json({
      success: true,
      message: "Signup OK",
      createUserStatus: userStatus,
      logoutStatus,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}
