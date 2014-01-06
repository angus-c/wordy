(function() {
  window.counter = {

    analyze: function(text, min) {
      this.data = {};
      this.data.total = 0;
      var wordCounts = {};
      var allWords = text.split(/[\?\!\.\,;]*[\s+–]|[\?\!\.\,;]$/);
      console.log(allWords);
      allWords.forEach(function(word) {
        if ((word.length >= min) && !/[^a-zA-ZÅåÄäâàáÖöØøÆæÉéÈèÜüÊêÛûÎî\-\']/.test(word)) {
          word = word.toLowerCase();
          wordCounts[word] ? wordCounts[word]++ : wordCounts[word] = 1;
          this.data.total++;
        }
      }, this);

      this.data.words = Object.keys(wordCounts).sort(
        function(a,b){return wordCounts[b]>wordCounts[a]?1:-1}).map(
          function(e) {return [e, wordCounts[e]]});

      console.log(this.data.words);

      return this;
    },

    tabulate: function() {
      var result = '';
      this.data.words.forEach(function(datum) {
        result += '<tr>';
        result += [
          '<td style="padding-right: 15px">',
          datum[0],
          '</td>',
          '<td  style="padding-right: 15px">',
          datum[1],
          '</td>',
          '<td  style="padding-right: 45px">',
          ['(', (100*(datum[1]/this.data.total)).toFixed(2), '%)'].join(''),
          '</td>'
        ].join('');
        result += '</tr>';
      }, this);
      return result;
    }
  }

  //based on https://github.com/kangax/detect-global/blob/master/detect-global.src.js
  var popup, table, closer, slider;
  function initPopup(cb) {
    popup = document.createElement('div');
    popup.id = 'popup';
    table = document.createElement('table');
    closer = document.createElement('span');
    slider = document.createElement('input');
    slider.id = "slider";
    slider.type = 'range';
    slider.min = 1;
    slider.max = 7;
    slider.value = 5;
    closer.innerHTML = 'x';

    popup.style.cssText = "position:fixed; right:10px; top:10px; height: 300px;padding: 1em; overflow: auto; background:rgba(50,50,50,0.9); -moz-border-radius:10px; z-index: 99999; font-family: 'Helvetica Neue', Verdana, Arial, sans serif";
    table.style.cssText = "color: #eee; border: 0; text-align: left; font-size: 11pt";
    closer.style.cssText = "position:absolute; right:10px; top:10px; font-size: 14pt; color: #aeaeae; cursor: pointer"

    popup.appendChild(closer);
    popup.appendChild(slider);
    popup.appendChild(table);
    document.body.appendChild(popup);

    closer.addEventListener('click', removePopup);
    slider.addEventListener('change', function() {run(document.getElementById('slider').value);});

    cb(slider.value);
  }

  function removePopup() {
    popup.parentNode.removeChild(popup);
    popup = null;
  }

  function updatePopup(rows) {
    table.innerHTML = rows;
  }

  function run(minSize) {
    updatePopup(counter.analyze(document.body.textContent, minSize).tabulate());
  }

  //run(document.getElementById('slider').value);
  initPopup(run);
})();



