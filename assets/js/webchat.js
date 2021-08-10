(function() {
  function initWebChat() {

    let popupWin;
    function windowOpener(url, name, args) {

      if(typeof(popupWin) != "object" || popupWin.closed)  {
        popupWin =  window.open(url, name, args);
      }
      else{
        popupWin.location.href = url;
      }

      popupWin.focus();
    }

    const button = document.querySelector('.chat-button');
    const webChat = document.querySelector('web-chat');
    const message = document.querySelector('#metrics');

    button.addEventListener('click', () => {
      windowOpener('/avaya-webchat', 'Web Chat - Divorce', 'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=350,height=550,left=100,top=100');
    });

    webChat.addEventListener('hide', () => {
      webChat.classList.add('hidden');
    });

    webChat.addEventListener('metrics', function(metrics) {
      const metricsDetail = metrics.detail;
      const ccState = metricsDetail.contactCenterState;
      const ewt = metricsDetail.ewt;
      const availableAgents = metricsDetail.availableAgents;
      const today = new Date();

      if (ccState !== 'Open' || today.getHours() < 9 || today.getHours() >= 17 || today.getDay() === 0 || today.getDay() === 6) {
        message.innerHTML = 'Web chat is now closed. Come back Monday to Friday 9am to 5pm. Or contact us using one of the ways below.';
        button.classList.add('hidden');
      } else if (ewt < 300 && availableAgents > 0) {
        message.innerHTML = '';
        button.classList.remove('hidden');
      } else {
        message.innerHTML = 'All our webchat QMCAs are busy helping other people. Please try again later or contact us using one of the ways below.';
        button.classList.add('hidden');
      }
    });
  
  }

  jQuery(function() {
    // wait until the DOM is ready
    initWebChat();
  });

}).call(this);
