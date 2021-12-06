const cardWrapper = document.querySelector('.card-wrapper.vacancies');

const handleGetData = () => {
  $.ajax({
    type: 'GET',
    url: `/vacancy`,
    success: async response => {
      const data = await response.vacancies
      console.log(data)
      
      data.forEach(item => {
          cardWrapper.innerHTML += `<div class="card">
                                      <h2>${ item.title }</h2>
                                      <div class="price-location">
                                          <img src="./media/swap.svg" alt="">
                                          <span>${ item.salary }</span>
                                          <img src="./media/location.svg" id="location" alt="">
                                          <span>${ item.location }</span>
                                      </div>
                                      <img src="./media/epam.png" alt="" id="company">
                                      <div class="card-bottom">
                                          <div class="button-work-time">
                                              ${ item.busyness }
                                          </div>
                                          <span class="public-time">38 минут назад</span>
                                      </div>
                                  </div>`
      })
    },
    error: function(error){
      console.log(error);
    }
  })
}

handleGetData();