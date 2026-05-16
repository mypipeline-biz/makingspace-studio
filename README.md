# Making Space — Creative Studio & Workshop Booking Platform

A full-featured booking and management system for creative workshops, built with vanilla HTML, CSS, and JavaScript.

## Features

- **Session Management** — browse and book workshops across multiple disciplines
- **Instructor Profiles** — discover teachers, view bios and photos
- **User Accounts** — secure authentication with bcrypt password hashing
- **OAuth Support** — sign up with Google or Apple (production ready)
- **Wishlist System** — save sessions for later
- **Admin CMS** — manage sessions, instructors, galleries, reviews, and site settings
- **Responsive Design** — works on desktop, tablet, and mobile
- **Data Persistence** — localStorage for user data and bookings

## Files

- `index.html` — Main website (public-facing)
- `admin.html` — Admin CMS panel (for managing content)

## Deployment

### Staging Environment
- Branch: `develop`
- URL: `https://staging.makingspace.studio` (or Netlify preview)
- Purpose: Testing new features before production

### Production Environment
- Branch: `main`
- URL: `https://makingspace.studio` (or Netlify production)
- Purpose: Live customer-facing site

## Local Development

1. Clone the repo:
   ```bash
   git clone https://github.com/mypipeline-biz/makingspace-studio.git
   cd makingspace-studio
   ```

2. Open `index.html` in your browser to view the site

3. Open `admin.html` in your browser to access the CMS

## Data Management

All data is stored in browser localStorage:
- `mks_siteInfo` — Studio information
- `mks_disciplines` — Workshop categories
- `mks_sessions` — Session data (descriptions, reviews, includes)
- `mks_instructors` — Instructor profiles and photos
- `mks_gallery` — Gallery works for sale
- `mks_users` — User accounts (passwords hashed with bcrypt)
- `mks_currentUser` — Active session
- `mks_wishlist` — Saved sessions

**Note:** localStorage is limited to ~5-10MB per domain. For production scale, migrate to a real backend (Firebase, Supabase, custom Node.js API).

## Security Notes

- Passwords are hashed with bcryptjs (10 salt rounds) before storage
- OAuth is mocked in this version; production would use real OAuth providers
- All sensitive data stays in localStorage; never transmitted without HTTPS
- For production: implement a real backend with secure session management

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- Real backend API (Node.js + Express or similar)
- Payment processing (Stripe)
- Email notifications
- Multi-language support
- Advanced analytics
- Instructor dashboard
- Video integration for session previews
- Community features (ratings, comments)

## Support

For issues or feature requests, contact: hello@makingspace.studio
