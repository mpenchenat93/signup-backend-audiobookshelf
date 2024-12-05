// api/signup.js

const BASE_URL = process.env.BASE_URL;

const LOGIN_URL = `${BASE_URL}/login`;
const CREATE_USER_URL = `${BASE_URL}/api/users`;
const LOGOUT_URL = `${BASE_URL}/logout`;

const LOGIN_CREDENTIALS = {
  username: process.env.LOGIN_USERNAME,
  password: process.env.LOGIN_PASSWORD,
};

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

async function createUser(token, { email, name, password }) {
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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, name, password } = req.body;

  try {
    const token = await performLogin();
    const userStatus = await createUser(token, { email, name, password });
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
