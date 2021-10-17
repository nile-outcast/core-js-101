/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.height = height;
  this.width = width;
  this.getArea = () => this.height * this.width;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  const arr = Object.values(obj);
  const Func = Object.create(proto);
  return new Func.constructor(...arr);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  Sel: class Sel {
    constructor() {
      this.elementName = '';
      this.idName = '';
      this.className = '';
      this.attrName = '';
      this.pseudoClassName = '';
      this.pseudoElementName = '';
      this.combineName = '';
    }

    element(value) {
      if (this.idName || this.className || this.attrName
        || this.pseudoClassName || this.pseudoElementName) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      } else if (this.elementName) {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      } else {
        this.elementName = value;
      }
      return this;
    }

    id(value) {
      if (this.className || this.attrName || this.pseudoClassName || this.pseudoElementName) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      } else if (this.idName) {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      } else {
        this.idName = `#${value}`;
      }
      return this;
    }

    class(value) {
      if (this.attrName || this.pseudoClassName || this.pseudoElementName) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      } else {
        this.className += `.${value}`;
      }
      return this;
    }

    attr(value) {
      if (this.pseudoClassName || this.pseudoElementName) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      } else {
        this.attrName += `[${value}]`;
      }
      return this;
    }

    pseudoClass(value) {
      if (this.pseudoElementName) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      } else {
        this.pseudoClassName += `:${value}`;
      }
      return this;
    }

    pseudoElement(value) {
      if (this.pseudoElementName) {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      } else {
        this.pseudoElementName = `::${value}`;
      }
      return this;
    }

    combine(selector1, combinator, selector2) {
      this.combineName += `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
      return this;
    }

    stringify() {
      return `${this.elementName}${this.idName}${this.className}${this.attrName}${this.pseudoClassName}${this.pseudoElementName}${this.combineName}`;
    }
  },

  element(value) {
    return new this.Sel().element(value);
  },

  id(value) {
    return new this.Sel().id(value);
  },

  class(value) {
    return new this.Sel().class(value);
  },

  attr(value) {
    return new this.Sel().attr(value);
  },

  pseudoClass(value) {
    return new this.Sel().pseudoClass(value);
  },

  pseudoElement(value) {
    return new this.Sel().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new this.Sel().combine(selector1, combinator, selector2);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
