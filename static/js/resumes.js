const cardWrapper = document.querySelector('.cards-container');

const handleGetData = () => {
    fetch('/resume/user')
        .then(data => data.json())
        .then(json => {
            const data = json.resume
        
            data.forEach(item => {
                let birthdate = new Date(item.birthdate).getFullYear();
                let nowYear = new Date().getFullYear();
                let years = nowYear - birthdate;
                cardWrapper.innerHTML += `<div class="card-resume">
                    <h3 class="card-resume-title">${item.careerObjective}</h3>
                    <div class="avatar-info">
                        <img src="${item.avatarURL}" alt="img: avatar">
                        <span>
                            ${item.firstname}
                            ${years} лет
                        </span>
                    </div>
                    <span class="card-resume-phone">${item.phone}</span>
                    <span class="card-resume-mail">${item.email}</span>
                    <div class="card-resume-checkbox">
                        <div class="input-filter mt-ios" style="font-size: 6px;">
                            <input data-id="${item._id}" id="${item._id}" class="isPublished" type="checkbox" style="background: none;" ${item.isPublished ? "checked" : ""}>
                            <label for="${item._id}"></label>
                            <span>Доступность резюме</span>
                        </div>
                    </div>
                    <a href="/resume/${item._id}/update" class="card-resume-button">Изменить</a>
                </div>`
                })
        })

        .then(json => {
            const publicCard = document.querySelectorAll('.isPublished');

            publicCard.forEach(card => {
                card.addEventListener('input', e => {
                    fetch('/resume/visible', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ id: card.dataset.id })
                    })
                })
            })
        })
}

handleGetData();