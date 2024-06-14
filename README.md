# ReactAndMorty

## Description

ReactAndMorty is a mobile application developed with React Native and Expo for viewing, managing, and saving news. The project is designed to be scalable, maintainable, and to provide a modern, accessible user experience.

---

## Design Decisions

### Design Pattern

- **Feature Sliced Architecture:**  
  The code is organized by features in independent folders, making the project scalable and maintainable.
- **Redux Toolkit:**  
  Used for simple and efficient global state management.
- **React Query:**  
  For asynchronous data management and HTTP request caching.
- **React Navigation:**  
  Enables smooth and decoupled navigation between screens.
- **Internationalization (i18n):**  
  Implemented with `react-i18next` to support multiple languages.
- **Reusable components:**  
  Clear separation between logic and presentation, with components like `NewsCard`.

### Main External Libraries

- [`react-native-paper`](https://callstack.github.io/react-native-paper/): Material Design UI.
- [`react-navigation`](https://reactnavigation.org/): Screen navigation.
- [`redux-toolkit`](https://redux-toolkit.js.org/): Global state management.
- [`@tanstack/react-query`](https://tanstack.com/query/latest): Data fetching and caching.
- [`react-i18next`](https://react.i18next.com/): Internationalization.
- [`@testing-library/react-native`](https://testing-library.com/docs/react-native-testing-library/intro/): Component testing.
- [`jest`](https://jestjs.io/): Testing framework.
- [`expo`](https://expo.dev/): Cross-platform development and build.

---

## Getting Started

### 1. Prerequisites

- Node.js >= 18
- Yarn or npm
- Expo CLI (`npm install -g expo-cli`)

### 2. Install dependencies

```sh
yarn install
# or
npm install
```

### 3. Run in development

```sh
yarn start
# or
npm start
```
This will open the Expo panel. From there you can launch the app in an Android/iOS emulator or on a physical device with the Expo Go app.

### 4. Run tests and view coverage

```sh
yarn test
# or
npm test
```

To view test coverage:

```sh
yarn test --coverage
# or
npm test -- --coverage
```

Unit and integration tests cover Redux slices, hooks, components, and screens, ensuring the quality and correct functioning of the logic and UI.  
Mocks are used for external dependencies (such as API calls, AsyncStorage, navigation, and i18n), and the expected behavior is verified from the user's perspective.

**Coverage reports** are generated in the `coverage/` folder.  
You can open `coverage/lcov-report/index.html` in your browser to see detailed coverage by file, including statements, branches, and functions.

---

## Project Structure

- `src/features/`: code for each functional domain (news, settings, users, etc.)
- `src/store/`: Redux configuration and middlewares
- `src/i18n/`: internationalization configuration and resources
- `src/navigation/`: navigation configuration
- `src/services/`: access to external APIs

---

## Evaluated Aspects and How They Are Addressed

### App Architecture and File System

- A modular architecture by features is followed, allowing the project to be easily scaled and maintained.
- Each feature has its own slice, hooks, components and tests.

### Best Practices, Code Quality, and Complexity

- Use of TypeScript for strict typing.
- Clear separation between logic and presentation.
- Reusable and decoupled components.
- Well-documented and easy-to-follow code.

### Implemented Patterns

- **Feature Sliced Architecture** for modularity.
- **Redux Toolkit** for global state management.
- **React Query** for data fetching and caching.
- **Internationalization** with i18next.
- **Testing** with Testing Library and Jest.

### Unit Tests

- Unit and integration tests are included for slices, hooks, and screens.
- The behavior of the UI and business logic is verified.
- Coverage is used to ensure code quality.
- Tests cover all main branches and edge cases, including error and loading states.

### UX/UI

- Modern and accessible UI with React Native Paper.
- Smooth and consistent navigation.
- Support for themes and accessibility.
- Clear messages for the user in all states (loading, error, empty, etc.).

### Performance

- Use of React Query to avoid unnecessary refetching.
- FlatList for efficient lists.
- Memoization of data and components where appropriate.
- Redux Toolkit to avoid unnecessary renders.

---

## Additional Notes

- **Internationalization:**  
  Texts are organized by feature and language, making localization and maintenance easier.
- **Testing:**  
  Tests use mocks for external dependencies and cover both logic and UI.  
  Coverage reports are generated and can be viewed in detail in the `coverage/` folder.
- **Style:**  
  The app's theme can be easily customized from the `App.tsx` file.
