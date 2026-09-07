# CivicResolve

CivicResolve is a cloud-ready civic issue reporting platform that helps citizens report, validate, prioritize, and track local infrastructure problems.

## Architecture

### Frontend
- React + Vite for the web client
- React Router for client-side navigation
- Axios for API requests
- Leaflet for map-based issue visualization

### Backend
- Node.js + Express for the API layer
- Mongoose for MongoDB Atlas data access
- Firebase Authentication for identity and access integration
- Cloudinary for image upload handling
- Gemini API for issue categorization and smart triage
- OpenStreetMap / Overpass API for location intelligence and civic POI lookup

### Data and services
- MongoDB Atlas as the primary application database
- Cloudinary for media storage
- Firebase Authentication for client auth and user identity
- Gemini API for AI-powered classification and recommendation support
- OpenStreetMap / Overpass API for map and location enrichment

### Application roles
- Citizen
- Worker
- Admin

## Cloud-ready deployment architecture

This project is designed for deployment in a managed cloud environment rather than a single local machine. The architecture separates:

- a React/Vite frontend served from a web host or static hosting layer
- a Node.js/Express backend API connected to MongoDB Atlas
- external managed services such as Firebase, Cloudinary, Gemini, and Overpass
- environment-based configuration for API, CORS, Firebase admin credentials, and secret management

The application is deployment-ready in structure, but this repository does not claim a live production deployment exists at this time.

## Configuration expectations

Production configuration should be supplied through environment variables and deployment secrets rather than committed source files. Required examples include:

- MongoDB connection string
- JWT secret
- Cloudinary credentials
- Gemini API key
- Firebase Admin credentials
- CORS origin allowlist
- frontend API URL settings
- server port

Configuration values must never be committed to source control and should be injected by the deployment platform or secret manager.

## Deployment overview

### Frontend deployment (Vercel)
- Deploy the contents of the frontend directory as a Vite React app.
- Use environment variables in the Vercel project settings.
- Set `VITE_API_URL` to the deployed Render backend URL, for example `https://your-render-backend.onrender.com/api`.
- Keep all Firebase client configuration values in Vite environment variables only; never place Firebase service-account credentials in the frontend.

### Backend deployment (Render)
- Deploy the backend directory as a Node.js web service.
- Use the production start command `npm start`.
- Set runtime environment variables in Render for MongoDB, JWT, Cloudinary, Gemini, Firebase Admin, and CORS.
- Expose a health endpoint at `/api/health` for deployment health checks.

### MongoDB Atlas
- Configure a MongoDB Atlas cluster and provide a production connection string through `MONGODB_URI`.
- Restrict connectivity to the Render backend IPs or private networking configuration as appropriate.

### Cloudinary
- Configure Cloudinary credentials using the following environment variables:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

### Firebase Authentication
- Configure Firebase client values in the frontend with Vite variables.
- Configure Firebase Admin credentials in the backend only via secret manager or environment variable injection.
- Supported backend credential inputs:
  - `FIREBASE_SERVICE_ACCOUNT`
  - or `FIREBASE_PROJECT_ID` + `FIREBASE_CLIENT_EMAIL` + `FIREBASE_PRIVATE_KEY`

### Gemini API
- Set `GEMINI_API_KEY` in the backend deployment environment.
- Do not expose it in frontend code.

### CORS configuration
- Set `CORS_ORIGIN` to the deployed frontend origin, for example `https://your-frontend.vercel.app`.
- If multiple origins are needed, provide a comma-separated allowlist.

### OpenStreetMap / Overpass
- Use the base Overpass endpoint via `OVERPASS_API_URL` when necessary.
- Keep the endpoint public and environment-configured when used in production.

## Required deployment variables

The following variable names should be provided in the deployment environment, with real values supplied by the platform or secret manager:

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `GEMINI_API_KEY`
- `CORS_ORIGIN`
- `OVERPASS_API_URL`
- `VITE_API_URL`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `FIREBASE_SERVICE_ACCOUNT`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

These values must remain outside source control.

## Deployment readiness status

This repository is prepared for cloud deployment configuration and environment-based production settings, but deployment has not been performed. The repository is ready for a deployment step once the target hosting platform values are supplied and verified.