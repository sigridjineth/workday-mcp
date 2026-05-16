<ralph_native_subagents>
You are in OMX Ralph persistence mode.
Primary task: UBC Workday MCP 서버를 개발하세요. 기술명세: /home/mconcat/.hermes/cache/documents/doc_3557f93d30a0_UBC_Workday_HAR_Only_Technical_Spec.md 참고.

필요한 구현:
1. src/index.ts - MCP 서버 진입점 (Server, StdioServerTransport)
2. src/utils/client.ts - Workday 인증/세션 관리 + HTTPS fetch
3. src/tools/ - 모든 read-only 도구 (feature toggles, course sections, course detail, grading basis, unmet coreqs)
4. src/tools/savedSchedule.ts - validate-only, create, update, get (write-gated, confirmation required)
5. src/tools/uiParser.ts - UI faceted search, course section detail, troubleshoot 파싱
6. package.json, tsconfig.json 설정
7. 빌드 및 기본 동작 테스트

인증은 raw cookie from HAR를 사용. config는 환경변수로 받되, 실제 값은 테스트 시 주입.

MCP 도구 스키마는 기술명세 9장을 정확히 따를 것.

작업 완료 후:
- npm run build 성공 확인
- npx ts-node --esm src/index.ts 로 서버 기동 테스트
- dogfooding: workday_get_feature_toggles 호출 시도
Parallelism guidance:
- Prefer Codex native subagents for independent parallel subtasks.
- Treat `.omx/state/subagent-tracking.json` as the native subagent activity ledger for this session.
- Do not declare the task complete, and do not transition into final verification/completion, while active native subagent threads are still running.
- Before closing a verification wave, confirm that active native subagent threads have drained.
Goal mode guidance:
- If Codex goal tools are available, call `get_goal` during Ralph intake or before final verification to discover the active thread goal.
- Treat any active goal objective as the top-level completion contract for this Ralph run; Ralph mode state is not proof of goal completion by itself.
- Call `create_goal` only when the user/system explicitly requested a new goal and `get_goal` reports no active goal; otherwise do not invent a goal.
- Before completion, build a prompt-to-artifact checklist, inspect real evidence for every requirement, and continue working if any item is missing, incomplete, weakly verified, or uncovered.
- Call `update_goal({status: "complete"})` only after that audit proves the active objective is fully achieved; then report final elapsed time and token-budget usage when provided.
Final deslop guidance:
- Step 7.5 must run oh-my-codex:ai-slop-cleaner in standard mode on changed files only, using the repo-relative paths listed in `.omx/ralph/changed-files.txt`.
- Keep the cleaner scope bounded to that file list; do not widen the pass to the full codebase or unrelated files.
- Step 7.6 must rerun the current tests/build/lint verification after ai-slop-cleaner; if regression fails, roll back cleaner changes or fix and retry before completion.
</ralph_native_subagents>
