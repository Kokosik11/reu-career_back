const cardWrapper = document.querySelector('.card-wrapper.vacancies');

const handleGetData = () => {
  $.ajax({
    type: 'GET',
    url: `/vacancy`,
    success: async response => {
      const data = await response.vacancies
      console.log(data)
      
      data.forEach(item => {
          let createdAt = new Date(item.createdAt);
          let date = Math.trunc((Date.now() - createdAt) / 1000 / 60 / 60 / 24 );
          let text = `${date} дня(-ей) назад`;
          if(date === 0) {
            text = "Опубликовано недавно";
          }
          cardWrapper.innerHTML += `<a href="/vacancy/${ item._id }" class="card">
                                      <h2>${ item.title }</h2>
                                      <div class="price-location">
                                          <img src="./media/swap.svg" alt="">
                                          <span>${ item.salary }р.</span>
                                          <img src="./media/location.svg" id="location" alt="">
                                          <span>${ item.location }</span>
                                      </div>
                                      <img src="${ item.logoURL }" alt="" id="company">
                                      <div class="card-bottom">
                                          <div class="button-work-time">
                                              ${ item.busyness }
                                          </div>
                                          <span class="public-time">${text}</span>
                                      </div>
                                  </a>`
      })
    },
    error: function(error){
      console.log(error);
    }
  })
}

handleGetData();