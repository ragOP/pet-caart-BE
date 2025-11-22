# pet-caart-be

This is the backend repository for petcaart.com - A one stop shop all pet requirements.

**Prerequisites**
- **Node.js**: Install Node.js 18+ (LTS) and `npm`.
- **MongoDB**: Local MongoDB or MongoDB Atlas connection string (`MONGO_URI`).
- **Environment**: Create a `.env` file in the project root with required keys (see below).

**Quick Start (Run Locally)**
- **Clone**: `git clone <repo-url>`
- **Change dir**: `cd pet-caart-BE`
- **Install deps**: `npm install`
- **Create env file**: create a file named `.env` in the project root and add the variables listed in **Environment Variables** below.
- **Run (development)**: `npm run dev` — starts with `nodemon` and watches `src/index.js`.
- **Run (production)**: `npm start` — runs `node src/index.js`.

**Environment Variables**
- **Minimum / common**:
	- `PORT` - port to run the server (default: `4000`).
	- `MONGO_URI` - MongoDB connection string.
	- `JWT_SECRET` - secret for signing JWT tokens.
- **Optional / service keys** (add if your features use them):
	- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
	- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME`
	- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
	- `FIREBASE_SERVICE_ACCOUNT` or path to Firebase service JSON (see `src/firebase/service_key.js`).
	- APN / push notification keys if used: `APN_KEY_ID`, `APN_TEAM_ID`, `APN_KEY_PATH`.

Note: Inspect files under `src/config/` (for example `src/config/db.js` and `src/config/cloudinary.js`) to find additional environment keys required by your setup.

**Project Structure (important paths)**
- **Entry**: `src/index.js`
- **Configuration**: `src/config/` (database, cloudinary, multer, s3, razorpay, etc.)
- **Routes**: `src/routes/` (grouped by resource)
- **Controllers**: `src/controllers/` (API handlers)
- **Models**: `src/models/` (Mongoose schemas)

**Development Tips**
- If you see errors about missing keys, check `.env` and `src/config/*` for required values.
- To format code: `npm run format`.
- Use `npm run dev` during development for automatic reloads.

**How to Contribute**
- **Branching**: Create a feature branch from `main`: `git checkout -b feat/short-description`.
- **Commits**: Write clear, focused commits. One logical change per commit.
- **Pull Request**: Push your branch and open a PR targeting `main`. Include a brief description of the change and any setup steps required to test it.
- **Code Style**: Run `npm run format` before opening a PR.

**Checking & Troubleshooting**
- If the server doesn't start, verify `MONGO_URI` and other required env variables.
- If a port is already in use, change `PORT` in `.env`.
- For missing module errors, run `npm install` and ensure dependencies from `package.json` are installed.

**Next Steps / Local Workflow Suggestions**
- Use a local MongoDB or MongoDB Atlas for development; give each contributor their own database URI.
- Store sensitive keys in your machine's environment or a secrets manager; do not commit them to the repo.

If you want, I can add an example `.env.example` file listing the variables above, or create a CONTRIBUTING.md with a PR checklist.
