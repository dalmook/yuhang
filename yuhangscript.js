document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const resultContainer = document.getElementById('resultContainer');
    let data = [];

    // JSON 데이터 불러오기
    fetch('yuhangdata.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
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
});
