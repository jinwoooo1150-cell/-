# Suo 스토어 제출 준비 문서

## 현재 상태 (2026-03-29 기준)
- Android 패키지명/버전코드/적응형 아이콘 설정 완료
- EAS production 빌드가 **AAB(app bundle)** 출력하도록 고정
- EAS submit 기본 트랙을 `internal`로 설정
- OTA 업데이트 안정성을 위해 `runtimeVersion` / `updates` 정책 추가

## 핵심 설정 파일
- `app.json`
- `eas.json`

## 검증 명령어
```bash
npm install
npx expo config --type public
npm run lint
```

## Android 빌드/제출 명령어
```bash
# 1) Play Console 업로드용 AAB 생성
npx eas build -p android --profile production

# 2) (선택) 내부 QA용 APK 생성
npx eas build -p android --profile preview

# 3) EAS Submit 사용 시 internal track 제출
npx eas submit -p android --profile production
```

## Play Store 제출 체크리스트
- [x] 앱 이름: `Suo`
- [x] slug: `suo-app`
- [x] Android package: `com.suo.app`
- [x] Android versionCode: `1`
- [x] Android adaptive icon: foreground/monochrome/background 지정
- [x] production buildType: `app-bundle` (AAB)
- [x] submit track: `internal`
- [ ] Play Console 앱 등록/개인정보처리방침 URL 입력
- [ ] Data safety 설문 작성
- [ ] 앱 설명/스크린샷/카테고리/콘텐츠 등급 입력
- [ ] 서명 키 관리(Play App Signing) 확인

## 참고
- 실제 출시 트랙(Closed/Open/Production)은 `eas.json`의 submit track 또는 Play Console에서 변경하세요.
- `versionCode` 자동 증가 정책은 `eas.json` production에 설정되어 있어, 다음 빌드부터 충돌 위험을 줄입니다.
