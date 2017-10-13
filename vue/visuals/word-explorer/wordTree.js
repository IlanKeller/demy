Array.prototype.flatMap = function(lambda) { 
  return Array.prototype.concat.apply([], this.map(lambda)); 
};

function WordTree() {
  this.root = null;
  this.fromPath = function(jsonPath, callback) {
    var thisWt = this
    d3.json(jsonPath, function(error, root) {
      if(error)
        alert(error)
      else { 
        thisWt.root = root
        if(callback) callback(thisWt);
      }
    });
    return this;
  };
  this.sameHierarchy = function(h1, h2) {
    return h1.length===h2.length && h1.every((v,i) => v === h2[i])
  };
  this.removeNotFrequent = function(node, ancestor, goDown) {
    if(!this.sameHierarchy(ancestor.hierarchy, node.hierarchy)) {
      var tWords = node.words
      tWords.forEach(tw => {
      //If the current word exists on ancestor but frequency is less than 1.5 times or containing less than the half of occurrences than the ancestor 
      //the word will be removed from the children
      if(ancestor.words.filter(aw => aw.hash===tw.hash && (1.0*(tw.count/node.totalWords) / (aw.count/ancestor.totalWords)<=1 || tw.count <= aw.count/2.0)).length>0) 
        node.words = node.words.filter(w => tw.hash!=w.hash)                
      });
      this.removeNotFrequent(node, ancestor.children.filter(c => this.sameHierarchy(node.hierarchy.slice(0, c.hierarchy.length), c.hierarchy))[0], false)
    }
    if(goDown) 
      node.children.forEach(c => this.removeNotFrequent(c, ancestor, true));
  };
  this.removeNotFrequentOnAncestor = function(node, ancestor, goDown) {
    if(!this.sameHierarchy(ancestor.hierarchy, node.hierarchy)) {
      var tWords = node.words
      tWords.forEach(tw => {
      //If the current word exists on ancestor but frequency is less than 1.5 times or containing less than the half of occurrences than the ancestor 
      //the word will be removed from the children
      if(ancestor.words.filter(aw => aw.hash===tw.hash && (1.0*(tw.count/node.totalWords) / (aw.count/ancestor.totalWords)>1 || tw.count > aw.count/2.0)).length>0) 
        ancestor.words = ancestor.words.filter(w => tw.hash!=w.hash)                
      });
      this.removeNotFrequentOnAncestor(node, ancestor.children.filter(c => this.sameHierarchy(node.hierarchy.slice(0, c.hierarchy.length), c.hierarchy))[0], false)
    }
    if(goDown) 
      node.children.forEach(c => this.removeNotFrequentOnAncestor(c, ancestor, true));
  };
  this.removeEmpty = function(node) {
    while(node.children.length>0 && node.children.filter(c => c.words.length===0 ).length>0) {
        var toRemove = node.children.filter(c => c.words.length==0);
        var toAdd = toRemove.flatMap(c => c.children).filter(gc => gc.words.length>0 || gc.children.length>0);
        node.children = (node.children.filter(c => !toRemove.map(r => r.hierarchy.join(",")).includes(c.hierarchy.join(","))).concat(toAdd));
    }
    node.children.forEach(c => this.removeEmpty(c));
  };
  this.removeLeafsBiggerThan = function(node, limit) {
    node.words = node.words.slice(0,limit)
    node.children.forEach(c => this.removeLeafsBiggerThan(c, limit))
  };
  this.getHeadWord = function(node) {
    var h = node.words.concat(node.children.map(c =>this.getHeadWord(c))).sort((w1, w2) => w1.count < w2.count);
    if(h.length>0)
      return h[0]
    return null;
  };
  this.popUpSingleWordLeaf = function(node) {
    node.children = node.children.filter(c => c.children.length > 0 || c.words.length>1);
    node.words = node.words.concat(node.children.filter(c => c.children.length == 0 && c.words.length==1).flatMap(c => c.words)).sort((w1, w2) => w1.count < w2.count);
    node.children.forEach(c => this.popUpSingleWordLeaf(c));
  };
  this.toHierarchy = function(node) {
    var head = this.getHeadWord(node) 
    var ret = {}; 
    ret.name=head.word;
    ret.size=head.count;

    if(node.words.length>0 || node.children.length>0)
    {
      ret.children = node.words.map(w => r = {"name":w.word, "size":w.count}).concat(
        node.children.map(c => this.toHierarchy(c))
      );
    }
    return ret;
  };
  this.keepIfDescendantContains = function(node, filter) {
    node.children = node.children.map(c => this.keepIfDescendantContains(c, filter)).filter(c => c)
    
    if(node.children.length==0 && node.words.map(w => w.word).filter(w => w.match(filter)).length == 0)
      return null;
    return node;
  };

  this.keepFirstWordIfNotContains = function(node, filter) {
    if(node.words.map(w => w.word).filter(w => w.match(filter)).length == 0)
      node.words = node.words.slice(0,1)
    node.children.forEach(c => this.keepFirstWordIfNotContains(c, filter));
  };
  this.keepWordsOnSize = function(node, min, max) {
    node.words = node.words.filter(w => w.count>=min && (!max || w.count<=max))
    node.children.forEach(c => this.keepWordsOnSize(c, min, max));
  }
    /*/If text matches one of node words we retain all the words except for 
    if(data.name.match(filtre)) 
      return data;
    //If a child matches the search then we return the matching child and single leaf brothers
    if(data.children && data.children.filter(c => c.name.match(filtre)).length>0) {
      data.children = data.children.filter(c => c.name.match(filtre) || !c.children)
      return data;
    }
    if(data.children) {
      var filtChildren = data.children.map(c => filterNodes(c, filtre)).filter(c => c);
      if(filtChildren.length > 0) {
        if(filtChildren.filter(c => !c.children).length == 0)
          filtChildren = filtChildren.concat(data.children.filter(c => !c.children).slice(0,1))
        data.children = filtChildren
        return data;
      }
    }
    return null; 
  }*/

}
