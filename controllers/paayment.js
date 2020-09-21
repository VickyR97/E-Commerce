var braintree = require("braintree");

var gateway = braintree.connect({
  environment:  braintree.Environment.Sandbox,
  merchantId:   'mfdfbp32zz5jkk87',
  publicKey:    'cbfgv5n9b65frqm5',
  privateKey:   'c414398bd31c0da7036c85af53b0e194'
});

exports.getToken = (req, res) =>{
    gateway.clientToken.generate({}, function (err, response) {
        if (err) {
            res.status(500).send(err)
        }else {
            res.send(response)
        }
      });
}

exports.processPayment = (req, res) =>{
    let nonceFromTheClient = req.body.nonceFromTheClient
    
    let amountFromTheClient = req.body.amount

    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, function (err, result) {
          if (err) {
            res.status(500).send(err)
        }else {
            res.send(result)
        }
          
    })

}