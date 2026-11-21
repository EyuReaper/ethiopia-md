# Security policy

## Reporting a vulnerability

Please do not report security vulnerabilities in a public issue or pull request.

Report them privately through GitHub's private security advisory feature:

1. Open <https://github.com/EyuReaper/ethiopia-md/security/advisories/new>.
2. Describe the problem, the component it affects, and the steps needed to reproduce it.
3. Say what impact you think it has, and whether you have a proposed fix.

The maintainer will acknowledge the report, discuss it with you in the advisory, and coordinate a fix and disclosure. Please give the maintainer a reasonable period to fix the problem before you publish details.

## Scope

In scope:

- The Astro static site in this repository: the pages, components, templates and client-side scripts.
- The `ethiopiamd` command-line tool in `cli/`.
- The build and validation scripts in `scripts/`, and the GitHub workflows in `.github/workflows/`, where they could expose secrets, allow code injection or let untrusted input run.

Out of scope:

- Factual errors in articles. Report those through the fact-correction issue template instead.
- Problems in third-party services the site links to, such as GitHub, Google Fonts or Wikimedia.
- Denial-of-service attacks that depend on high traffic volumes.
- Findings from automated scanners with no demonstrated impact.

## Bug bounty

There is no bug bounty programme. Reports are appreciated and credited in the advisory, if you want credit.

## Supported versions

Only the `main` branch is maintained. Security fixes are made there.
