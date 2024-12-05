curl -X POST http://localhost:3000/api/signup \
-H "Content-Type: application/json" \
-d '{"email":"test@example.com","name":"John Doe","password":"secret"}'

curl -X POST https://backend-topaz-tau.vercel.app/api/api/signup \
-H "Content-Type: application/json" \
-d '{"email":"test@example.com","name":"John Deer","password":"secret"}'
