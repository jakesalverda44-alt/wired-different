#!/usr/bin/env bash
# Point the whole site at a real domain in one command.
#
#   ./tools/set-domain.sh wireddifferent.com
#   ./tools/set-domain.sh wireddifferent.com jake@wireddifferent.com
#
# Rewrites canonical tags, Open Graph / Twitter URLs, JSON-LD ids, the sitemap
# and robots.txt. Optionally swaps the contact email everywhere too.
# Review with `git diff` before committing.
set -euo pipefail

NEW_DOMAIN="${1:-}"
NEW_EMAIL="${2:-}"
OLD_HOST="wired-different.onrender.com"
OLD_EMAIL="wir3ddifferent@gmail.com"

if [[ -z "$NEW_DOMAIN" ]]; then
  echo "usage: $0 <domain-without-scheme> [contact-email]" >&2
  exit 1
fi

NEW_DOMAIN="${NEW_DOMAIN#http://}"
NEW_DOMAIN="${NEW_DOMAIN#https://}"
NEW_DOMAIN="${NEW_DOMAIN%/}"

cd "$(dirname "$0")/.."

FILES=$(git ls-files '*.html' '*.xml' '*.txt' '*.md' '*.yaml' '*.js' '*.css')

echo "Rewriting $OLD_HOST -> $NEW_DOMAIN"
# shellcheck disable=SC2086
sed -i "s|$OLD_HOST|$NEW_DOMAIN|g" $FILES

if [[ -n "$NEW_EMAIL" ]]; then
  echo "Rewriting $OLD_EMAIL -> $NEW_EMAIL"
  # shellcheck disable=SC2086
  sed -i "s|$OLD_EMAIL|$NEW_EMAIL|g" $FILES
fi

echo
echo "Done. Remaining references to the old host (should be none):"
grep -rn "$OLD_HOST" $FILES || echo "  none"
echo
echo "Next: git diff, then commit. Also update the domain in Render, Google"
echo "Search Console, the Meta pixel domain verification, and GA4 data stream."
