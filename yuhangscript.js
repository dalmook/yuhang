document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const resultContainer = document.getElementById('resultContainer');
    const exampleContainer = document.getElementById('exampleContainer');
    let data = [];

    // JSON 데이터 불러오기
    fetch('yuhangdata.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            displayRandomExamples();
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

        displayResults(results);
    });

    // 엔터 키로도 검색 가능하게
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            searchButton.click();
        }
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
});
