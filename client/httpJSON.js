var ajaxPost= function ( url, data, successFunction)
{
    $.ajax({
          type: 'POST',
              contentType:'application/json',
              url: url,
              data: JSON.stringify(data),
              success: successFunction(),
              dataType:'json'
          });
}

var ajaxGet= function ( url,successFunction)
{
    $.ajax({
            type: 'GET',
            contentType:'application/json',
            url: url,
            dataType:'json',
            success: function(data)
            {
                return data;
            }

          });

};
