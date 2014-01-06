(function() {
  window.counter = {

    analyze: function(text, min, regex) {
      this.data = {};
      this.data.total = 0;
      var wordCounts = {};
      var allWords = text.split(/[\?\!\.\,;]*[\s+–]|[\?\!\.\,;]$/);
      allWords.forEach(function(word) {
        word = word.toLowerCase();
        if ((word.length >= min) &&
          !/[^a-zA-ZÅåÄäâàáÖöØøÆæÉéÈèÜüÊêÛûÎî\-\']/.test(word) &&
          regex.test(word)) {
            wordCounts[word] ? wordCounts[word]++ : wordCounts[word] = 1;
            this.data.total++;
        }
      }, this);

      this.data.words = Object.keys(wordCounts).sort(
        function(a,b){return wordCounts[b]>wordCounts[a]?1:-1}).map(
          function(e) {return [e, wordCounts[e]]});

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
  var popup, table, closer, slider, regex;
  function initPopup(cb) {
    popup = document.createElement('div');
    popup.id = 'popup';
    table = document.createElement('table');
    closer = document.createElement('span');
    slider = document.createElement('input');
    slider.id = 'slider';
    slider.type = 'range';
    slider.min = 1;
    slider.max = 7;
    slider.value = 5;
    regex = document.createElement('input');
    regex.id = 'regex';
    regex.type = 'text';
    regex.value = '.';

    closer.innerHTML = 'x';

    popup.style.cssText = "position:fixed; right:10px; top:10px; height: 300px; min-width: 400px; padding: 1em; overflow: auto; background:rgba(50,50,50,0.9); -moz-border-radius:10px; z-index: 99999; font-family: 'Helvetica Neue', Verdana, Arial, sans serif";
    table.style.cssText = "color: #eee; border: 0; margin-top: 30px; text-align: left; font-size: 11pt";
    slider.style.cssText = "position:absolute; left:10px; top:15px; width: 150px; color: #fff; background-color: #000";
    regex.style.cssText = "position:absolute; left:180px; top:10px; width: 200px; font-size: 11pt; color: #fff; background:rgba(50,50,50,0.9); outline: 0";
    closer.style.cssText = "position:absolute; right:10px; top:10px; font-size: 14pt; color: #aeaeae; cursor: pointer";

    popup.appendChild(closer);
    popup.appendChild(slider);
    popup.appendChild(regex);
    popup.appendChild(table);
    document.body.appendChild(popup);

    closer.addEventListener('click', removePopup);
    //clean this up...
    slider.addEventListener('change', function() {runFromPopup});
    regex.addEventListener('keyup', function() {runFromPopup});

    closer.addEventListener('click', removePopup);
    slider.addEventListener('change', runFromPopup);
    regex.addEventListener('keyup', runFromPopup);

    runFromPopup();

    function runFromPopup() {
      console.log('run');
      run(
        document.getElementById('slider').value,
        new RegExp(document.getElementById('regex').value)
      );
    }
  }


  function removePopup() {
    popup.parentNode.removeChild(popup);
    popup = null;
  }

  function updateContent(rows) {
    table.innerHTML = rows;
  }

  function run(minSize, regex) {
    updateContent(
      counter.analyze(
        document.body.textContent,
        minSize,
        regex
      ).tabulate()
    );
  }

  initPopup();
})();



