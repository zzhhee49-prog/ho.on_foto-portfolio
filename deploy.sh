#!/bin/bash
echo "========================================"
echo "   정지훈 작가 포트폴리오 GitHub 배포기"
echo "========================================"
echo ""
echo "깃허브(GitHub) 웹사이트에서 새로 만드신 저장소(Repository)의 주소를 입력해주세요."
echo "예시: https://github.com/내아이디/travel-portfolio.git"
echo "----------------------------------------"
read -p "주소 입력: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "오류: 주소가 입력되지 않았습니다. 배포를 취소합니다."
    exit 1
fi

# 기존 리모트가 있다면 초기화
git remote remove origin 2>/dev/null

# 리모트 추가
git remote add origin "$REPO_URL"

# 메인 브랜치명 설정
git branch -M main

echo ""
echo "----------------------------------------"
echo "GitHub 저장소로 파일 업로드를 시작합니다."
echo "※ 로그인 창이 뜨면 GitHub 로그인을 완료해주세요."
echo "----------------------------------------"

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "🎉 성공적으로 GitHub에 업로드가 완료되었습니다!"
    echo "========================================"
    echo "이제 아래 마지막 단계만 수행해주시면 사이트 주소가 열립니다:"
    echo "1. GitHub의 해당 저장소 페이지로 들어갑니다."
    echo "2. 상단 메뉴의 [Settings] -> 좌측 메뉴의 [Pages]로 이동합니다."
    echo "3. Build and deployment 영역의 Branch를 'main'으로 선택하고 [Save]를 누릅니다."
    echo "4. 1분 뒤 공개 주소로 사이트가 전 세계에 공개됩니다!"
else
    echo ""
    echo "오류: 업로드에 실패했습니다. GitHub 인증 상태를 확인해주세요."
fi
