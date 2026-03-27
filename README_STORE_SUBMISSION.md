# Suo 스토어 제출 준비 문서

## 1) 변경된 파일 목록
- `app.json`
- `eas.json`
- `README_STORE_SUBMISSION.md`

## 2) 변경 이유
- Expo 앱 메타데이터를 스토어 제출 기준(이름/slug/scheme/번들 식별자/패키지명/버전)으로 정렬했습니다.
- iOS iPad 대응을 위해 `supportsTablet: true`, `requireFullScreen: false`를 설정했습니다.
- EAS Build/Submit 실행 가능한 기본 프로파일(`preview`, `production`)을 추가했습니다.
- 실제 코드 구조를 유지한 채(iOS/Android 빌드 설정 중심) 최소 수정 원칙으로 반영했습니다.

## 3) 실행 명령어
```bash
npm install
npx expo config --type public
```

## 4) 빌드 방법
```bash
# Android production build
npx eas build -p android --profile production

# iOS production build
npx eas build -p ios --profile production

# (선택) 내부 테스트 빌드
npx eas build -p android --profile preview
npx eas build -p ios --profile preview
```

## 5) 스토어 제출 체크리스트
- [x] 앱 이름: `Suo`
- [x] slug: `suo-app`
- [x] version: `1.0.0`
- [x] scheme: `suoapp`
- [x] iOS bundleIdentifier: `com.suo.app`
- [x] iOS buildNumber: `1.0.0`
- [x] iOS supportsTablet: `true`
- [x] iOS requireFullScreen: `false`
- [x] Android package: `com.suo.app`
- [x] Android versionCode: `1`
- [x] Android adaptive icon 경로가 실제 파일을 참조함
- [x] `eas.json` 생성
- [ ] Privacy Policy URL 입력 필요 (TODO)
- [ ] Support URL 입력 필요 (TODO)
- [ ] EAS projectId 연결 필요 (TODO)
- [ ] 스토어 설명/키워드/스크린샷 준비 필요 (TODO)
- [ ] 심사용 계정 준비 필요 (TODO)

## 6) iPad 관련 주의사항
- 현재 UI 로직은 유지했고, 레이아웃 위험 지점만 점검했습니다.
- 다수 화면이 전체 너비를 그대로 사용하는 구조라 iPad 가로폭에서 콘텐츠가 과도하게 넓어질 수 있습니다.
- 일부 컴포넌트는 고정 폭/absolute 배치를 사용해 초대형 화면에서 비율이 어색해질 가능성이 있습니다.
- 권장: 주요 콘텐츠 영역에 `maxWidth` + `alignSelf: "center"` 도입(후속 작업).

## 7) TODO 목록
- [ ] **Privacy Policy URL**: App Store / Play Console 제출용 실제 URL 입력
- [ ] **Support URL**: 고객 지원 페이지 URL 입력
- [ ] **EAS projectId**: `eas init` 또는 대시보드 연결 후 `expo.extra.eas.projectId` 반영
- [ ] **앱 설명 / 스크린샷**: 한/영 설명 및 기기별 캡처 준비
- [ ] **심사용 계정**: 로그인 필요한 경우 테스트 계정/가이드 준비
- [ ] **iPad 레이아웃 개선 필요 지점**
  - [ ] `app/(tabs)/index.tsx`: 메인 콘텐츠 최대 폭 제한 검토
  - [ ] `app/study/quiz/[id].tsx`: 관계도 UI 고정 폭(`width: 118`, `maxWidth: 108`) 반응형 검토
  - [ ] `app/study/vocab-test.tsx`: 하단 absolute 바(`position: "absolute"`) + 넓은 화면 여백 처리 검토
  - [ ] `app/study/works.tsx`: 일부 액션 버튼 최소 너비(`minWidth: 124`) 유지 여부 점검

---

## 사전 점검 결과 (실파일 기준)
- Expo 설정 파일: `app.json` 사용 중
- `package.json`의 `main`: `expo-router/entry` (Expo Router 사용 중)
- assets 존재 확인
  - icon: `assets/images/icon.png`
  - splash: `assets/images/splash-icon.png`
  - android adaptive foreground: `assets/images/android-icon-foreground.png`
  - android adaptive monochrome: `assets/images/android-icon-monochrome.png`
  - favicon: `assets/images/favicon.png`
