<div align="center">

# HER WAKA — Programme Documentation

**Employment-focused workshops for women in Auckland, delivered by [SheSharp](https://www.shesharp.org.nz) for MSD clients.**

[Live Site](https://herwaka.shesharp.org.nz/) | [SheSharp Website](https://www.shesharp.org.nz)

</div>

---

## About

HER WAKA is a four-session employment programme running March–June 2026 at academyEX Auckland. The programme supports women re-entering the workforce through hands-on workshops covering AI skills, job readiness, employment rights, and professional networking.

This repository contains the documentation site that serves as the workshop hub — storing teaching content, resources, and programme information for participants.

## Site Structure

| Section | Content |
|---------|---------|
| **Programme** | About HER WAKA, session schedule, about SheSharp |
| **March 2026 Workshop** | AI & Future of Work — overview, tools intro, hands-on exercises, resources |
| **Resources** | Employment rights (NZ), job readiness, networking guide |

## Tech Stack

- [Mintlify](https://mintlify.com) — documentation framework (almond theme)
- MDX pages with YAML frontmatter
- SheSharp brand design system (`#c846ab` / `#9b2e83` / `#8982ff`)

## Development

```bash
# Install Mintlify CLI
npm i -g mint

# Preview locally
npx mint dev

# Check for broken links
npx mint broken-links
```

Local preview runs at `http://localhost:3000`.

## Deployment

Connected to Mintlify via GitHub app. Changes pushed to `main` are deployed automatically to [herwaka.shesharp.org.nz](https://herwaka.shesharp.org.nz/).

## Licence

This project is licensed under the [MIT Licence](./LICENSE).

---

<div align="center">

Built with care by [SheSharp](https://www.shesharp.org.nz) | NZ Registered Charity [CC57025](https://register.charities.govt.nz/Charity/CC57025)

</div>
