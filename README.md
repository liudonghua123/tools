# Online Tools

![License](https://img.shields.io/github/license/liudonghua123/tools)
![Build Status](https://github.com/liudonghua123/tools/actions/workflows/deploy.yml/badge.svg)

A professional, responsive online toolbox built with Vue 3, Vite, and Tailwind CSS.
Supports Internationalization (English/Chinese).

## Features

- **Identity Tools**: ID Card information checker and random generator (China Mainland).
- **Network Tools**: Port Query tool with data fetched from Wikipedia.
- **Responsive Design**: Looks great on mobile and desktop.
- **Dark Mode Support**: Automatically adapts to system preference.

## Tech Stack

- Vue 3
- Vite
- Tailwind CSS
- Vue Router & i18n
- GitHub Actions (for automated data fetching and deployment)

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## Data Updates

Port data is fetched automatically during the build process using `scripts/fetch_ports.js`.
You can run it manually:
```bash
node scripts/fetch_ports.js
```

## License

MIT © [liudonghua123](https://github.com/liudonghua123)
