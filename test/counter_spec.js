var text = "SCÈNE I. Au sein profond de l'océan enterré; C'est  maintenant \
l'hiver de notre mécontentement. Qui attend à votre grâce? grand-mère!"

describe("counter", function() {
  describe("analyze", function() {
    it("should be a method", function() {
      expect(typeof counter.analyze).toEqual('function');
    });
    it("should return the counter", function() {
      expect(counter.analyze(text)).toEqual(counter);
    });
    it("should set data.total to word count", function() {
      counter.analyze(text, 1, /./);
      expect(counter.data.total).toEqual(20);
    });
    it("should register unique words once", function() {
      counter.analyze(text, 1, /./);
      var grandmereArray = counter.data.words.filter(function(e) {return e[0] == 'grand-mère'})[0];
      expect(grandmereArray[1]).toEqual(1);
    });
    it("should register multiple words multiple times ", function() {
      counter.analyze(text, 1, /./);
      var deArray = counter.data.words.filter(function(e) {return e[0] == 'de'})[0];
      expect(deArray[1]).toEqual(2);
    });
    it("should filter by simple regex", function() {
      counter.analyze(text, 5, /râc/);
      expect(counter.data.total).toEqual(1);
    });
    it("should filter by positional regex", function() {
      counter.analyze(text, 5, /nd$/);
      expect(counter.data.total).toEqual(2);
    });

  });
});