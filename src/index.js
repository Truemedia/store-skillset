const Data = require('data-bite');
const {Language, Template} = require('hightech');
const {Buyer, Currency, Seller, Parties, Ledger, TransactionLog} = require('payment-provider');
// Resolvers
const resolver = {
  productSearch: require('./resolvers/product_search'),
  productQuote: require('./resolvers/product_quote'),
  serviceSearch: require('./resolvers/service_search'),
  serviceQuote: require('./resolvers/service_quote'),
  offer: require('./resolvers/offer')
};


const Store = {
    /**
      * Check if skill is compatable with current intent
      */
    canHandle(handlerInput)
    {
        let request = handlerInput.requestEnvelope.request;

        let capable = false;
        switch (request.intent.name) {
          case 'productSearch':
          case 'serviceSearch':
          case 'productQuote':
          case 'serviceQuote':
          case 'offer':
            capable = true;
          break;
        }

        return capable;
    },

  /**
    * Handle input from intent
    */
  handle(handlerInput)
  {
    // TODO: Load from config
    let locale = 'en_GB';
    let locales = ['en_GB', 'ja_JP'];
    let langs = ['eng', 'jpn'];

    return new Promise( (resolve, reject) => {
      let {request} = handlerInput.requestEnvelope;
      let dataService = new Data().service();
      let pathOptions = {cwd: __dirname};
      let lang = new Language(locale, locales, langs, pathOptions);

      // Payment
      let currency = new Currency('token');
      let balance = new Ledger(currency, [
        TransactionLog.income('UNIQUE_REF', [
          {
            prices: [{'token': 4}]
          }
        ])
      ]);

      let parties = new Parties(
        new Buyer(request.session.author.username, balance),
        new Seller('Retailer', new Ledger(currency)),
      );

      lang.loadTranslations().then(() => {
        let templater = new Template(pathOptions, lang.gt);

        switch (request.intent.name) {
          case 'productSearch': resolve( resolver.productSearch(request, dataService, templater) ); break; // Product search
          case 'serviceSearch': resolve( resolver.serviceSearch(request, dataService, templater) ); break; // Service search
          case 'productQuote': resolve( resolver.productQuote(request, dataService, templater) ); break; // Product quote
          case 'serviceQuote': resolve( resolver.serviceQuote(request, dataService, templater) ); break; // Service quote
          case 'offer': resolve( resolver.offer(request, dataService, templater, parties) ); break; // Offer
        }
      });
    });
  }
};

module.exports = Store;
