# Publishing

We use GitHub actions to publish new versions of this repository. To publish, perform the following actions:

1. Checkout the `master` branch and `pull` to ensure your local branch is current — `git checkout master && git pull origin master`
2. Run `yarn version` and select the next version number (being careful to differentiate between releases and release candidates) — `yarn version`
3. Push the resulting commit to the origin's `master` branch — `git push origin master`
4. Push the resulting tags to origin — `git push origin --tags`
5. In the GitHub UI, find [the tag you just pushed](https://github.com/Netflix/x-element/tags) and find the "Create release" option.
6. Add any additional release information (including to check the box if it's a "pre-release", it probably is!).

By _creating a release_, the "Release" GitHub action will be triggered and if all the tests pass, it'll publish.
