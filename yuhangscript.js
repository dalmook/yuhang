document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const refreshButton = document.getElementById('refreshButton'); // 새로고침 버튼 추가
    const searchInput = document.getElementById('searchInput');
    const resultContainer = document.getElementById('resultContainer');
    const exampleContainer = document.getElementById('exampleContainer');
    const randomYearContainer = document.getElementById('randomYearContainer');
    let data = [];

    // JSON 데이터 불러오기
    fetch('yuhangdata.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            displayRandomExamples();
            displayRandomYearTerms();
        })
        .catch(error => {
            console.error('데이터를 불러오는 중 오류 발생:', error);
            resultContainer.innerHTML = '<p>데이터를 불러오는 데 문제가 발생했습니다.</p>';
        });

    // 검색 기능
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query === '') {
            resultContainer.innerHTML = '<p>검색어를 입력해주세요!</p>';
            return;
        }

        const results = data.filter(item => item.term.includes(query));

        if (results.length === 0) {
            // 검색어가 없는 경우 텔레그램으로 전송
            sendMissingTerm(query);
            resultContainer.innerHTML = '<p>검색 결과가 없습니다. 해당 유행어가 추가될 예정입니다!</p>';
            return;
        }

        displayResults(results);
    });

    // 엔터 키로도 검색 가능하게
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });

    // 새로고침 버튼 기능
    refreshButton.addEventListener('click', () => {
        // 검색 입력 초기화
        searchInput.value = '';

        // 검색 결과 초기화
        resultContainer.innerHTML = '';

        // 예시 유행어 다시 표시
        displayRandomExamples();

        // 연도별 랜덤 유행어 다시 표시
        displayRandomYearTerms();
    });

    // 결과 표시 함수
    function displayResults(results) {
        if (results.length === 0) {
            resultContainer.innerHTML = '<p>검색 결과가 없습니다. 다른 유행어를 시도해보세요!</p>';
            return;
        }

        const html = results.map(item => `
            <div class="result-item">
                <h2>${item.term}</h2>
                <p>${item.definition}</p>
                <span class="year">유행 시기: ${item.year}</span>
            </div>
        `).join('');

        resultContainer.innerHTML = html;
    }

    // 랜덤 예시 유행어 표시 함수
    function displayRandomExamples() {
        if (data.length === 0) return;

        // 기존 예시 유행어 초기화
        exampleContainer.innerHTML = '';

        // 랜덤으로 3개의 유행어 선택
        const shuffled = data.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);

        // 예시 단어 표시
        const exampleHTML = selected.map(item => `
            <span class="example-term">${item.term}</span>
        `).join(', ');

        exampleContainer.innerHTML = `<p>🔥 대표 유행어 예시: ${exampleHTML}</p>`;

        // 예시 단어에 클릭 이벤트 추가
        const exampleTerms = document.querySelectorAll('.example-term');
        exampleTerms.forEach(term => {
            term.addEventListener('click', () => {
                searchInput.value = term.textContent;
                searchButton.click();
            });
        });
    }

    // 랜덤 연도별 유행어 표시 함수
    function displayRandomYearTerms() {
        if (data.length === 0) return;

        const decades = ['2020년대', '2010년대'];
        const termsPerDecade = 5;
        decades.forEach(decade => {
            const decadeSection = document.getElementById(`year${decade.slice(0, 4)}s`);
            if (!decadeSection) return;

            // 해당 연도대의 유행어 필터링
            const decadeTerms = data.filter(item => item.year === decade);
            if (decadeTerms.length === 0) {
                decadeSection.querySelector('.year-terms').innerHTML = '<li>유행어가 없습니다.</li>';
                return;
            }

            // 기존 연도별 유행어 초기화
            decadeSection.querySelector('.year-terms').innerHTML = '';

            // 랜덤으로 최대 5개의 유행어 선택
            const shuffled = decadeTerms.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, termsPerDecade);

            // 유행어 목록 표시
            const termsHTML = selected.map(item => `
                <li>${item.term}</li>
            `).join('');

            decadeSection.querySelector('.year-terms').innerHTML = termsHTML;

            // 유행어 항목에 클릭 이벤트 추가
            const termItems = decadeSection.querySelectorAll('.year-terms li');
            termItems.forEach(term => {
                term.addEventListener('click', () => {
                    searchInput.value = term.textContent;
                    searchButton.click();
                });
            });
        });
    }

    // 검색어가 없는 경우 텔레그램으로 전송하는 함수
    function sendMissingTerm(term) {
        const serverUrl = 'https://yuhang-beta.vercel.app/api/send-missing-term'; // Vercel에 배포된 서버리스 함수의 URL로 변경

        fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ term })
        })
        .then(response => response.json())
        .then(data => {
            console.log('서버 응답:', data);
        })
        .catch(error => {
            console.error('서버 전송 오류:', error);
        });
    }
});