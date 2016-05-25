var express = require( 'express' )();
var mongoose = require( 'mongoose' );
var bodyparser = require( 'body-parser' )
var Signups = require( './signup_model.js' );
express.use( bodyparser.json() )
express.post( '/signup', function( req, res ) {
    console.log( req.body );
    Signups.validate( req.body )
        .then( function() {
            Signups.create( req.body, function( err, data ) {
                if ( err ) res.sendStatus( '500' );
                else res.sendStatus( '200' );
            } );
        } )
        .catch( function() {
            res.sendStatus( '400' );
        } )
} );
express.listen( process.env.PORT );
mongoose.connect( process.env.DB );
mongoose.connection.on( 'error', ( err ) => {
    console.log( err );
} );