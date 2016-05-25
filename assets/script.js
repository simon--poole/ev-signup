$( document )
    .ready( function() {
        $( '#modal' )
            .openModal( {
                dismissible: false, // Modal can be dismissed by clicking outside of the modal
                in_duration: 0, // Transition in duration
                out_duration: 0, // Transition out duration
            } );
        $( '#submit' )
            .click( function() {
                if ( !$( '#email' )[ 0 ].checkValidity() ) {
                    $( 'body' )
                        .scrollTo( '#email' );
                    $( '#email' )
                        .focus();
                    return;
                }
                if ( !$( '#tos' )[ 0 ].checkValidity() ) {
                    $( 'body' )
                        .scrollTo( '#tos' );
                    $( '#tos' )
                        .focus();
                    return;
                }
                $( '#form' )
                    .slideUp();
                $( '#loader' )
                    .slideDown();
                var data = {
                    email: $( '#email' )
                        .val(),
                }
                var comments = $( '#comments' )
                    .val();
                if ( $.trim( comments )
                    .length > 0 ) data.comments = comments;
                $.post( {
                        url: "https://ev-signup.herokuapp.com/signup",
                        data: data
                    } )
                    .done( function() {
                        $( '#loader' )
                            .slideUp();
                        $( '#results-success' )
                            .slideDown();
                    } )
                    .fail( function( res ) {
                        console.log( res );
                        $( '#loader' )
                            .slideUp();
                        $( '#results-error' )
                            .slideDown();
                    } )
            } )
    } )