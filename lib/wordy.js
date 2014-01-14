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

  var popup, table, closer, slider, regex;
  function initPopup(cb) {
    popup = document.createElement('iframe');
    popup.frameBorder = 0
    document.body.appendChild(popup);
    var iDocument = popup.contentDocument;
    popup.id = 'popup';
    table = iDocument.createElement('table');
    closer = iDocument.createElement('span');
    slider = iDocument.createElement('input');

    slider.id = 'slider';
    slider.type = 'range';
    slider.min = 1;
    slider.max = 8;
    slider.value = 5;
    slider.title = 'minimum word size';

    regex = iDocument.createElement('input');
    regex.id = 'regex';
    regex.type = 'text';
    regex.value = '.';
    regex.title = 'filter by regular expression';

    closer.innerHTML = 'x';
    closer.title = 'close';

    popup.style.cssText = "position:fixed; right:10px; top: 0; height: 300px; min-width: 400px; z-index: 99999999; overflow: auto";
    iDocument.body.style.cssText = "font-family: 'Helvetica Neue', Verdana, Arial, sans serif; background:rgba(50,50,50,0.9); font-size: 11pt";
    table.style.cssText = "color: #eee; border: 0; margin-top: 30px; text-align: left; font-size: 9pt";
    slider.style.cssText = "position:absolute; left:10px; top:5px; width: 150px; color: #fff; background-color: #000";
    regex.style.cssText = "position:absolute; left:180px; top:5px; width: 150px; background: transparent; outline: 0; color: #fff; border: solid 1px white";
    closer.style.cssText = "position:absolute; right:10px; top:3px; font-size: 14pt; color: #aeaeae; cursor: pointer";

    iDocument.body.appendChild(closer);
    iDocument.body.appendChild(slider);
    iDocument.body.appendChild(regex);
    iDocument.body.appendChild(table);


    closer.addEventListener('click', removePopup);
    //clean this up...
    slider.addEventListener('change', function() {runFromPopup});
    regex.addEventListener('keyup', function() {runFromPopup});

    closer.addEventListener('click', removePopup);
    slider.addEventListener('change', runFromPopup);
    regex.addEventListener('keyup', runFromPopup);

    runFromPopup();

    function runFromPopup() {
      run(
        iDocument.getElementById('slider').value,
        new RegExp(iDocument.getElementById('regex').value)
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



