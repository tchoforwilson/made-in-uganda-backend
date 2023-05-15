import GenRandomVal from './genRandVal.js';

const secretMinLength = 8;
const secretMaxLength = 16;
const smallMinLength = 5;
const smallMaxLength = 30;
const NUM_OF_IMG = Number(5);

const CONST_ONEU = Number(1);
const PERCENT = Number(100);

const MIN_PRICE = Number(500);
const MAX_PRICE = Number(100000);

class UnitTest {
  /**
   * Generate random valid user
   * @returns {Object} user
   */
  GenRandomValidUser() {
    const user = {
      name: GenRandomVal.GenRandomValidString(smallMaxLength),
      telephone: GenRandomVal.GenRandomValidTelephone(),
      email: GenRandomVal.GenRandomValidEmail(),
      employees: GenRandomVal.GenRandomInteger(smallMaxLength),
      location: {
        address: {
          city: GenRandomVal.GenRandomValidString(smallMaxLength),
          address_line: GenRandomVal.GenRandomValidString(smallMaxLength),
        },
        description: GenRandomVal.GenRandomValidText(30),
      },
    };
    return user;
  }

  /**
   * @breif Generate random valid user with password
   * @returns {Object} user Generated user
   */
  GenRandomValidUserWithPassword() {
    const password = GenRandomVal.GenRandomValidStringInRange(
      secretMinLength,
      secretMaxLength
    );
    const user = this.GenRandomValidUser();
    Object.assign(user, { password, passwordConfirm: password });
    return user;
  }

  /**
   * Generate valid users
   * @param {Number} max -> Maximum number of user to be generated
   * @returns {Array} users -> Generated users
   */
  GenRandValidUsers(max) {
    const users = [];
    for (let i = 0; i < max; i++) {
      users.push(this.GenRandomValidUserWithPassword());
    }
    return users;
  }

  /**
   * @breif Generate a random valid product category
   * @returns {Object}
   */
  GenRandomValidCategory() {
    return {
      name: GenRandomVal.GenRandomValidString(smallMaxLength),
    };
  }

  /**
   * @breif Generate a random valid product categories
   * @param {Number} max -> Maximum number of categories
   * @returns {Array}
   */
  GenRandomValidCategories(max) {
    const categories = [];
    for (let i = 0; i < max; i++) {
      categories.push(this.GenRandomValidCategory());
    }
    return categories;
  }

  /**
   * @breif Generate a random valid product object
   * @param {String} storeId -> Store to which product belong
   * @param {String} categoryId -> Category Id of the product
   * @return {Object} -> Generated product
   */
  GenRandomValidProduct(storeId, categoryId) {
    const currencies = ['UGX', 'USD', 'EURO'];
    return {
      name: GenRandomVal.GenRandomValidString(smallMaxLength),
      price: {
        value: GenRandomVal.GenRandomIntegerInRange(MIN_PRICE, MAX_PRICE),
        currency: GenRandomVal.GenRandomItem(currencies),
      },
      priceDiscount: GenRandomVal.GenRandomIntegerInRange(
        CONST_ONEU,
        MIN_PRICE
      ),
      weight: GenRandomVal.GenRandomIntegerInRange(CONST_ONEU, PERCENT),
      imageCover: GenRandomVal.GenRandomIntegerInRange(CONST_ONEU, NUM_OF_IMG)
        .toString()
        .concat('.jpeg'),
      description: GenRandomVal.GenRandomValidText(PERCENT),
      category: categoryId,
      store: storeId,
    };
  }
  /**
   * @breif Generate random number of products
   * @param {Number} max -> Maximum number of products
   * @param {String} storeId -> Store ID to which products belong
   * @param {String} categoryId -> Product category
   * @returns {Array}
   */
  GenRandomValidProducts(max, storeId, categoryId) {
    const products = [];
    for (let i = 0; i < max; i++) {
      products.push(this.GenRandomValidProduct(storeId, categoryId));
    }
    return products;
  }
}

const UnitTestBases = new UnitTest();

export default UnitTestBases;
