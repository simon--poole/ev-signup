var express = require( 'express' )();
var mongoose = require( 'mongoose' );
var bodyparser = require( 'body-parser' )
var Signups = require( './signup_model.js' );

express.use( bodyParser.urlencoded( {
    extended: true
} ) )
express.use( bodyparser.json() );

express.use( function( req, res, next ) {
    res.header( "Access-Control-Allow-Origin", req.protocol + "://eventvods.com" );
    res.header( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept" );
    next();
} );
express.post( '/signup', function( req, res ) {
    console.log( req.body );
    Signups.validate( req.body )
        .then( function() {
            Signups.create( req.body, function( err, data ) {
                if ( err ) res.sendStatus( '500' );
                else res.sendStatus( '200' );
            } );
        } )
        .catch( function( errs ) {
            res.status( '400' )
                .json( errs );
        } )
} );
express.listen( process.env.PORT );
mongoose.connect( process.env.DB );
mongoose.connection.on( 'error', ( err ) => {
    console.log( err );
} );