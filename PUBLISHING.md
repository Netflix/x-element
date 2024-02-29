# Publishing

We use GitHub actions to publish new versions of this repository. To publish, perform the following actions:

1. Ensure your local `main` branch is checked-out and current — `git checkout main && git pull origin main`.
2. Run `npm run bump` to view the current version. Then, run the same command and provide the version to bump to (e.g., `npm run bump 1.0.0-rc.57`). Note, keywords like `major`, `minor`, `patch`, etc. _are_ supported.
3. Push the resulting commit and tags — `git push origin main --follow-tags`.
4. In the GitHub UI, find [the tag you just pushed](https://github.com/Netflix/x-element/tags) and find the "Create release" option. Add any additional release information (including to check the box if it's a "pre-release", it probably is!).

By _creating a release_, the "Publish" GitHub action will be triggered and if all the tests pass, it’ll publish to all the registries we care about.
