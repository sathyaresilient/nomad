# Nomadly - Issue Fix Roadmap

## Current Status
- ✅ Production API: https://api.nomadly.community (working)
- ✅ Database: Supabase (connected via Session Pooler)
- ✅ CI/CD: GitHub Actions → Cloud Run (working)
- ⚠️ Local Web App: Running but has React errors
- ⚠️ Mobile App: APK built, needs testing

---

## Phase 1: Fix Frontend Build Errors (Priority: High)

### 1.1 Fix React Error #130 (Element type invalid)
**File:** Various component files
**Issue:** Some components have invalid imports or missing exports
**Steps:**
1. Run `npx expo start --web` and check console for specific errors
2. Fix any components with missing default exports
3. Verify all imports are correct paths

### 1.2 Fix Deprecated Style Props
**Issue:** `shadow*` and `textShadow*` props are deprecated
**Steps:**
1. Search for `textShadowColor`, `textShadowOffset`, `textShadowRadius`
2. Replace with `textShadow` CSS property
3. Search for `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`
4. Replace with `boxShadow` CSS property

**Example fix:**
```typescript
// Before
textShadowColor: 'rgba(0,0,0,0.5)',
textShadowOffset: { width: 0, height: 1 },
textShadowRadius: 4,

// After (for web)
textShadow: '0 1px 4px rgba(0,0,0,0.5)',
```

### 1.3 Update Expo Packages
**Issue:** Version mismatches causing potential issues
**Command:**
```bash
npx expo install --fix
```

---

## Phase 2: API Integration Testing (Priority: High)

### 2.1 Test Auth Flow End-to-End
**Steps:**
1. Register a new user via web app
2. Login with the new user
3. Verify JWT token storage
4. Test protected routes

### 2.2 Test CORS Configuration
**Check:** Ensure API allows requests from localhost and production domains
**File:** `backend/services/api-gateway/src/index.ts`

### 2.3 Verify Environment Variables
**Local (.env):**
```
EXPO_PUBLIC_API_URL=https://api.nomadly.community
```
**Production (Cloud Run):**
- NODE_ENV=production
- DATABASE_URL=(session pooler URL)

---

## Phase 3: Mobile App Testing (Priority: Medium)

### 3.1 Install APK on Android Device
**Download:** https://expo.dev/accounts/sathya123334/projects/nomadly/builds/31feba01-1211-4e6e-8184-7fea80df0516

### 3.2 Test Core Features
- [ ] Registration/Login
- [ ] Profile creation
- [ ] Trip creation
- [ ] View trips list
- [ ] Groups
- [ ] Chat (if implemented)

### 3.3 Fix Any Mobile-Specific Issues
- Test on different screen sizes
- Check for iOS-specific issues (if building for iOS later)

---

## Phase 4: Backend Improvements (Priority: Medium)

### 4.1 Add Missing API Routes
**Currently missing:**
- `/api/v1/connections` - Connection/friend requests

### 4.2 Add Error Handling
- Improve error messages for frontend
- Add request validation
- Add rate limiting

### 4.3 Add Logging & Monitoring
- Set up Sentry for error tracking (already in package.json)
- Add request logging

---

## Phase 5: Production Hardening (Priority: Low)

### 5.1 Security
- [ ] Review JWT expiration times
- [ ] Add refresh token rotation
- [ ] Implement password requirements
- [ ] Add rate limiting per user

### 5.2 Performance
- [ ] Add Redis caching (currently using mock)
- [ ] Optimize database queries
- [ ] Add pagination to all list endpoints

### 5.3 CI/CD Improvements
- [ ] Add staging environment
- [ ] Add automated tests
- [ ] Add database migrations in CI

---

## Quick Commands

```bash
# Start local web development
npx expo start --web

# Build Android APK
npx eas-cli build --platform android --profile preview

# Build iOS (requires Apple Developer account)
npx eas-cli build --platform ios --profile preview

# Run backend locally
cd backend && npm run dev

# Deploy backend (push to main triggers CI/CD)
git push origin main

# Check production API
curl https://api.nomadly.community/health

# View Cloud Run logs
gcloud run services logs read nomadly-prod-api-gateway --region=us-central1
```

---

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────────────┐     ┌──────────────┐
│   Mobile App    │────▶│  api.nomadly.community  │────▶│   Supabase   │
│   (Expo/RN)     │     │  (Cloud Run + Fastify)  │     │  PostgreSQL  │
└─────────────────┘     └─────────────────────────┘     └──────────────┘
        │                         │
        │                         │
┌───────▼─────────┐     ┌─────────▼───────────────┐
│    Web App      │     │   GitHub Actions        │
│  (localhost)    │     │   (CI/CD Pipeline)      │
└─────────────────┘     └─────────────────────────┘
```

---

## Next Steps (In Order)

1. **Now:** Fix the React web errors by running dev server and checking console
2. **Today:** Test the Android APK on a real device
3. **This Week:** Complete Phase 1 & 2
4. **Next Week:** Phase 3 & 4
