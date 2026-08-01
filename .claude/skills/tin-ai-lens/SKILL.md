```markdown
# tin-ai-lens Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches you the core development patterns and workflows for contributing to the `tin-ai-lens` repository. The project is written in TypeScript and focuses on browser-based AI analysis, extension development, and modular type-safe code. You'll learn about file organization, code style, common workflows for adding features or preparing releases, and how to structure and run tests.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `analyzeLocal.ts`, `byok.ts`, `browserAnalyze.ts`

### Import Style
- Mixed import styles are used, but prefer named imports when possible.
  ```typescript
  import { analyze } from './analyzeLocal';
  import * as Types from '../../types/src/analyze';
  ```

### Export Style
- Use **named exports**.
  ```typescript
  // Good
  export function analyzeLocal(...) { ... }
  export const BYOK = { ... };

  // Avoid default exports
  ```

### Type Definitions
- Place shared types in `packages/types/src/`
  ```typescript
  // packages/types/src/analyze.ts
  export type AnalysisResult = { ... };
  ```

### Example: Adding a New Analysis Function
```typescript
// apps/extension/lib/myNewAnalysis.ts
export function myNewAnalysis(input: string): AnalysisResult {
  // implementation
}
```

## Workflows

### Add or Refactor Browser Analysis
**Trigger:** When you want to add or improve browser-safe AI analysis in the extension, especially for BYOK (Bring Your Own Key) or optimizing bundle size and compatibility.  
**Command:** `/add-browser-analysis`

1. **Create or update analysis logic** in `extension/lib` (e.g., `analyze-local.ts`, `byok.ts`).
   ```typescript
   // apps/extension/lib/analyze-local.ts
   export function analyzeLocal(input: string): AnalysisResult { ... }
   ```
2. **Implement or refactor browser-specific entry points** in `packages/ai/src` (e.g., `browser-analyze.ts`).
   ```typescript
   // packages/ai/src/browser-analyze.ts
   import { analyzeLocal } from '../../../apps/extension/lib/analyze-local';
   export function browserAnalyze(input: string) { return analyzeLocal(input); }
   ```
3. **Update or add type definitions** in `packages/types/src` (e.g., `analyze.ts`, `trust-report.ts`).
   ```typescript
   // packages/types/src/analyze.ts
   export type AnalysisInput = { ... };
   ```
4. **Update `package.json`** to reflect new entry points or scripts if needed.
   ```json
   // packages/ai/package.json
   {
     "main": "src/browser-analyze.ts",
     ...
   }
   ```
5. **Update configuration or documentation** as needed.

**Files Involved:**
- `apps/extension/lib/analyze-local.ts`
- `apps/extension/lib/byok.ts`
- `packages/ai/src/browser-analyze.ts`
- `packages/ai/package.json`
- `packages/types/src/analyze.ts`
- `packages/types/src/trust-report.ts`

---

### Extension Feature or Release Preparation
**Trigger:** When you want to release a new version of the extension or add significant user-facing features.  
**Command:** `/prepare-extension-release`

1. **Update `README.md`** with new features or publishing instructions.
2. **Modify or add packaging scripts** in `package.json` or `scripts/` directory.
   - Example: `apps/extension/scripts/gen-icon.py`
3. **Add or update assets** (e.g., icons, screenshots) in the `assets/` or `store/` directories.
   - Example: `apps/extension/assets/icon.png`
4. **Create or update documentation files** (e.g., `LISTING.md`, privacy policy).
   - Example: `apps/extension/store/LISTING.md`
5. **Update extension configuration files** as needed.
   - Example: `apps/web/app/privacy/page.tsx`

**Files Involved:**
- `README.md`
- `apps/extension/package.json`
- `apps/extension/scripts/gen-icon.py`
- `apps/extension/assets/icon.png`
- `apps/extension/store/LISTING.md`
- `apps/extension/store/screenshots/.gitkeep`
- `apps/web/app/privacy/page.tsx`

---

## Testing Patterns

- **Test files** use the pattern `*.test.*` (e.g., `analyzeLocal.test.ts`).
- **Testing framework** is unknown; check for test runner in `package.json` or project scripts.
- **Example test file:**
  ```typescript
  // apps/extension/lib/analyzeLocal.test.ts
  import { analyzeLocal } from './analyzeLocal';

  test('analyzeLocal returns expected result', () => {
    const result = analyzeLocal('input');
    expect(result).toEqual({ ... });
  });
  ```

## Commands

| Command                   | Purpose                                                           |
|---------------------------|-------------------------------------------------------------------|
| /add-browser-analysis     | Add or refactor browser-based AI analysis functionality           |
| /prepare-extension-release| Prepare the extension for release or add major user-facing features|
```
