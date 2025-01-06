# Contributing to `pads-layout-parser`

Thank you for your interest in contributing to `pads-layout-parser`! We welcome contributions from everyone, whether you're fixing a bug, adding a new feature, improving documentation, or suggesting enhancements.

## Ways to Contribute

*   **Report Bugs:** If you find a bug, please open an issue on the [issue tracker](https://github.com/your-username/pads-layout-parser/issues). Be sure to include a clear description of the bug, steps to reproduce it, and example PADS code that demonstrates the problem.
*   **Suggest Enhancements:** If you have an idea for a new feature or improvement, please open an issue to discuss it. We're always open to new ideas!
*   **Submit Pull Requests:** If you'd like to contribute code, please follow the guidelines below.

## Development Setup

1.  **Fork the Repository:** Fork the `pads-layout-parser` repository to your own GitHub account.
2.  **Clone Your Fork:** Clone your forked repository to your local machine:

    ```bash
    git clone git@github.com:firechip/pads-layout-parser.git
    cd pads-layout-parser
    ```
3.  **Install Dependencies:** Install the project's dependencies using npm:

    ```bash
    npm install
    ```
4.  **Build the Project:** Build the project to compile the TypeScript code:

    ```bash
    npm run build
    ```

## Making Changes

1.  **Create a Branch:** Create a new branch for your changes:

    ```bash
    git checkout -b my-feature-branch
    ```
2.  **Make Your Changes:** Make your code changes, add new features, or fix bugs.
3.  **Write Tests:** Write unit tests to cover your changes and ensure that they don't break existing functionality. We use Jest as our testing framework. You can add tests to the `__tests__` directory.
4.  **Run Tests:** Run the test suite to make sure all tests pass:

    ```bash
    npm test
    ```
5.  **Format Code:** Format your code using Prettier (if applicable):

    ```bash
    npm run format
    ```
6.  **Lint Code:** Lint your code using ESLint (if applicable):

    ```bash
    npm run lint
    ```
7.  **Commit Your Changes:** Commit your changes with a clear and descriptive commit message:

    ```bash
    git commit -m "Add a new feature"
    ```

## Submitting Pull Requests

1.  **Push Your Branch:** Push your branch to your forked repository:

    ```bash
    git push origin my-feature-branch
    ```
2.  **Open a Pull Request:** Go to the original `pads-layout-parser` repository on GitHub and open a new pull request from your branch.
3.  **Describe Your Changes:** Clearly describe your changes in the pull request description. Explain the problem you're solving or the feature you're adding, and provide any relevant context or background information.
4.  **Reference Issues:** If your pull request addresses an existing issue, reference it in the description using the `#` symbol (e.g., "Fixes #123").
5.  **Review:** Be prepared to respond to feedback and make changes as requested by the maintainers.

## Coding Style

*   Follow the existing coding style in the project.
*   Use meaningful variable and function names.
*   Write clear and concise comments.
*   Keep your code well-organized and modular.

## Testing Guidelines

*   Write unit tests for all new features and bug fixes.
*   Aim for high test coverage.
*   Use the existing test files as examples.
*   Test error handling and edge cases thoroughly.
*   Ensure that your tests are independent and do not rely on external resources.

## Code of Conduct

Please be respectful and constructive in all your interactions with other contributors and maintainers. We follow the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

## License

By contributing to `pads-layout-parser`, you agree that your contributions will be licensed under the [MIT License](LICENSE).

## Questions?

If you have any questions about contributing, please feel free to open an issue or contact the maintainers directly.

We appreciate your contributions!
