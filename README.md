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

---

<!-- CHAN MENG PERSONAL BRAND -->
<div align="center">
  <a href="https://github.com/ChanMeng666" target="_blank">
    <img src="./.github/brand/chan-meng-logo.svg" alt="Chan Meng" width="160" />
  </a>

  <p><strong>Chan Meng</strong><br/>Need a custom app like this one? I build them — let's talk.</p>

  <a href="mailto:chanmeng.dev@gmail.com"><img src="https://img.shields.io/badge/Email-chanmeng.dev@gmail.com-EA4335?style=flat-square&logo=gmail&logoColor=white" alt="Email Chan Meng"/></a>
  <a href="https://github.com/ChanMeng666"><img src="https://img.shields.io/badge/GitHub-ChanMeng666-181717?style=flat-square&logo=github&logoColor=white" alt="Chan Meng on GitHub"/></a>
</div>
<!-- /CHAN MENG PERSONAL BRAND -->
