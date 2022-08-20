---
layout: post
title:  'Data Engineering Series [Part27]: Redis'
description: 
date:   2022-08-02 15:01:35 +0300
image:  '/images/redis_logo.png'
logo_image:  '/images/data_engineering_logo.png'
categories: DE
tags: Data_Engineering
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---
in this article i'm going to be covering everything you need to know about redis. starting with what redis is moving on to how to install it all of the commands you need to know and then finally ending up with a real world example of how you would implement redis yourself. this is a really important video to watch because redis can be included in every single production level application and it's going to make your application more performant. so let's get started now.  

redis is essentially a type of database and more specifically it is a nosql database. but it's not very similar to any other nosql databases. it's definitely not similar to mongodb and it's obviously very different than sql databases like postgres and mysql and this is because redis doesn't really have any idea of tables or documents and instead all of the data in redis is
stored inside of key value pairs. so think about a json object you have the key name and you have the value kyle. this is essentially a key value pair and redis is just like one giant json object that has key value pairs and that's all that you have inside of redis. so it's not very good at storing a bunch of structured data like you have in sql .but it's really good for storing you know individual key value pairs that you need to access or get data from another.  

important thing to note about redis is that unlike a normal database that runs on your disk and stores all your information on disk. redis actually runs inside of your working memory your ram on your computer and this means that redis is incredibly fast because it's all working inside of ram. but it's much more unstable because if all of a sudden your system crashes you're going to lose everything that's in redis unless you're backing it up consistently, which is why redis is generally not used as like an actual persistent database store like you have with mongodb and postgres and instead it's used more **for caching** where you take things that are really you know things that you access a lot or things that take a long time to compute and you store those values inside of redis that way when you need to access them in the future. it's incredibly quick since redis is in the memory already loaded. it's milliseconds to get data as opposed to hundreds of milliseconds or even seconds of time to get data from a traditional database.  


really the important thing to realize about redis is that it's going to be built on top of a traditional database. almost always you're going to have your mongodb or postgres database in the background and you're going to have redis sitting in front of that database and any time that you have a really long or slow query to your database or you have data you access all the time but doesn't change that much what you're going to do is you're going to store that data inside of redis as well as inside your database. and then when you go to get that information if it's already in redis you can access that data in milliseconds as opposed to going all the way to the database. computing the data and then coming all the way back which is going to take you hundreds to even thousands of milliseconds depending on how complex your data is. so redis is going to take your app and make it hundreds to even thousands of times faster when it comes to querying these pieces of information.  

let's actually talk about how we can install redis. installing redis on your computer is really simple if you have a mac or linux computer. if you use mac just use homebrew to do the install and if you're on linux just use your package manager of choice to install it. it's just called redis it's that simple. but if you're on windows it's a bit more complex. because there is no way to install redis on windows. instead you need to go through the windows subsystem for linux which is pretty simple to install.
so as you can see i am currently inside
of a linux terminal using the windows
subsystem for linux on my computer and
then all you need to do in order to
install this if you're using ubuntu
is just say sudo apt get
install and then just type in redis and
then you need to type in your password
that you set up for your account and
it's going to go through and install the
redis for me for you it'll take a little
bit longer to download but i already
have it downloaded so it's pretty quick
and then once you get it installed just
type in redis dash server
this is going to start up your redis
server and as you can see it just prints
out a bunch of information
and it says running in standalone mode
on port 6379 and that's just the default
port for redis
so now redis is running on port 6379 so
in order to access redis we just need to
open up a new terminal and if you're on
windows make sure you open up a windows
sub linux terminal here and then we can
just type in redis dash
cli and now we can actually access redis
and run commands kind of like you could
do a node with a cli
so for example one thing that we could
do inside of here is just type quit and
that exists
out of the cli obviously we want to be
in the cli though so the very first
thing we can do is add things to our
database
because like i said this is a key value
paired database so the main thing that
you're going to do is setting a value
for a key
and getting a value for a key so we can
type in set
and it can be all uppercase all
lowercase it doesn't matter generally
the
idea though is to use all capitals then
we're just going to type in our key our
key is just going to be name and we'll
put in a value of kyle
and then we hit enter and you can see it
said okay to check to see if this worked
we can type in git
and the name of our key which is just
name and as you can see we get the value
of kyle being returned back to us
and you'll notice something about redis
is that pretty much everything you store
inside of redis is going to be a type of
string
by default so if we set for example age
equal to
26 and then we come here and we get our
age you're going to notice it comes back
as this kind of string type
technically redis is smart enough to
know this is an integer but it really
doesn't matter because when you're
accessing and dealing with these things
they're pretty much always going to come
back to you as strings when you're
dealing with redis now with redis we can
also do a delete so i could say you know
delete age
and now if i do git age you can see it
returns to me null here
because there is no age at all because i
deleted that key so we can set keys we
can get keys and we can delete keys and
finally we can also just have this
command called
exists and this is just you type in a
key for example name whoops if i spell
name correctly
and you can see it returns to us one
saying that this is true and when i
typed name incorrectly it returns 0
which means false so you can determine
whether or not this key exists or not
so that's kind of like the most basic
things that you can do inside of redis
for setting
getting deleting and checking if they
exist also what you can do is check to
find all the keys that match a certain
pattern so if you just put star this is
going to get you all the keys right now
we only have one key which is name
so that's why it's returning to us name
this is a great way just to see what's
inside of your database
you can also get rid of everything in
your database by just typing flush
all hit enter and now we check our keys
you're going to notice we have no keys
at all
and this is a really great way to just
clear everything out if you're having
problems with your caching you can just
clear the entire cache
and now there's nothing at all inside of
it but i can go back and i can say set
name kyle
and then i can get name and as you can
see it's returning to me that name also
if you want to just clear out the input
just type the word clear that's going to
clear everything out for you
and then a few additional things that i
really want to talk about is the idea of
expiration so if we just type in ttl and
then the key name which our case is name
this stands for time to live and as you
can see this time to live is negative
one
that just means it has no expiration at
all it's going to live forever
but you can actually make keys so that
they expire at some point
i could for example type in expire and
then name and i want it to expire in 10
seconds
and now when i check the ttl for name
you can see that this is constantly
counting down
and once it gets all the way down to
zero it's going to completely delete
this key so as you can see one
now we're essentially negative two
negative two means it is gone now if we
do get
name you can see there is no longer
anything for this name key because we'd
expired it after 10 minutes
and if you want to make sure a key
expires when you set it you can use the
command
set ex and that's going to give you a
key in our case name
we can give it how long we want it to
last let's say 10 seconds and then the
value of kyle so it works just like set
but you can actually put the expiration
right here
and now when i ttl that name you can see
it's constantly counting down from 10
and once it gets all the way down to
zero it's going to delete that key
now that covers most of what you're
going to be doing inside of redis since
you're mostly going to be dealing with
strings
but red is also a support for handling
arrays in the form of
list and they also have hashes for kind
of storing like json objects
so let's talk a list first in red is if
you want to add an item to a list
you're going to say l push and this is
going to add an item to the start of
your list that's what the l
stands for it stands for left or start
so we can give our list a name which is
our key let's just say
friends and then we're going to give
this thing a value that we're pushing on
so let's just push on
john here and now we have a key friends
that has
john inside of the array of it so we
could say git
friends and you're going to notice it's
saying hey this is the wrong type we
can't get this and that's because git
only works for strings if we want to
print out a list
we need to do instead is say l range
then we say
friends which is the key that we want to
get and then we say we start at index 1
and stop at index negative 1. that means
get all the items in the list
as you can see we get john being printed
out because that's the only thing in the
list
let's push another item to the left or
the start of our list
so we can say l push inside of friends
because that's the name of our array
and we can say we want to push in sally
here as well and now if we get all the
values you can see sally got pushed to
the front
and then john got added on also with
these list you can push on the end or
the right hand side by using r push
it works the same way as l push but it's
going to add it to the end of the array
so let's put in here you know mic and if
we check this you can now see that mike
got put onto the end of the array you
can also take
items on and off of the array by using
something called l
pop and r pop they are going to be the
left and the right hand pop
so l pop you just type in friends and
it's going to take the first item on the
left or the start of our array
take it off and return it to us so it
took sally away from the array returned
it to us
and now if we look at our array you can
see sally is gone if we do
our pop of friends and we now print out
our array you can see it got rid of mike
which was the last item in our array so
it took out the thing on the right hand
side a list like this is really useful
for any type of queue or stack that you
want to have like let's say you have a
messaging app and you want to cache
the five most recent messages from a
user well you can constantly just
push on to the array so you could do
like an l push to push onto the top of
the array
and then you could do an r pop to remove
the last item that way you always make
sure you have five things in there and
it's going to be the most recent five
and once you get a newer item it's gonna
push off the oldest one and put this
newest one right on top of it that'd be
a great use case for this list type
the next thing i want to talk about is
sets and sets are very similar to list
because they're like an array structure
but it's a unique array if you know
anything about sets inside a javascript
which i'll link up a video i've done on
them up in the top right in the cards
a set is essentially just a list that is
completely unique every value in the
list is unique
and it's not put in particular order
like an array is so if you want to
create a set
you have to prefix everything with s so
we can say like s add
and then we can give it a key unless
we'll say here that we have hobbies
and inside of here we're going to pass
in a value this is very similar to like
pushing to an array but we're adding to
this set
so let's just push in here the hobby of
weight lifting
and you'll notice i wrap this in quotes
if i have more than one word so now if i
want to get all the things inside of
here
we can say s members oops s
members and this is just going to print
out everything inside of that thing so
hobbies is the thing we want to check
and as you can see we got all the values
inside of hobbies being printed out and
like i said with sets it's essentially
completely unique so if i try to add
weightlifting back in here again you can
see we got 0 being returned saying that
it was a false it could not add this
because it's already there
and if we check you can see it didn't
add it we only have just that one thing
inside there weightlifting
also with this we can do a remove so we
can just say
sram that stands for remove from hobbies
and we want to remove that value of
weight
lifting and now if we check our members
you can see that it's an empty list
there's nothing at all inside of it
now finally i want to talk about hashes
and hashes are just another key value
pair
so you can think of it as like a key
value pair inside of a key value pair
but with hashes you can't have hashes
inside of hashes so it's like a json
object but you can't have any nesting at
all inside of it it's just one set of
key value pairs
so to do anything with hashes you're
going to prefix every command with an h
so if we want to set a value we could
say h set and let's just say that we
want to have a person
the field we want to set as their name
and we want to give it the value of kyle
so now what we can do is we can say h
get and we want to get person and we
want to get the name from that person
and you can see it returns to us kyle
and if we wanted to get everything about
that person we could just use get all
type in person now you can see we have
the key name and the value of kyle so it
prints out the key first
and then the value second and we can add
other things so if we go back to each
set
we can instead set an age so let's say
that we want to do an h set for our
person we want to set the age and we're
going to set it to a value of 26.
now we do a get all you can see we have
a name of kyle and we have an age of
26 and we can get individual properties
so for example i could say you know get
just the name
or i could say just the age for that
person or we could do that get all again
and get all the different key value
pairs
you can also do an hdel which is going
to be a delete so let's say that i
wanted to delete the age property
and now i printed everything out you can
see there's only the name right here
and also i could do an exist so i could
say h exists
and i could say person and name and you
can see that returns true with the
integer of one
and age returns false with the integer
of zero so hashes are essentially a
great way if you need to store like key
value pairs inside of an individual key
but like i mentioned at the beginning
almost everything you're going to be
doing inside of redis is going to be
dealing specifically with
string so you're going to be doing like
sets and gits and expirations and that's
like 95
of what you need to do inside of redis
so speaking of that let me show you a
real world example of how you would take
redis and implement it inside of the
back end of an application to speed it
up by about 10 to 50 times
so here i have a really simple express
node.js application with two different
endpoints
one is for getting all of the photos and
one is for getting an individual folder
and in each one of these endpoints all
that we do is we call out this json
placeholder api to get a list of photos
or we call it to get an individual photo
and here we also have the option to pass
in an album id
to just limit the size of the list and
this code you can just imagine this
right here could be anything it could be
calling a database
calling some other api this is just like
your main code that runs inside of your
server
and this is pretty slow code because
there's a lot of data to fetch and it's
calling out to an api which is always
going to be pretty slow
on the right hand side here we have my
own version of postman that i created
if you're interested in learning how i
created this i have a whole video on it
linked up in the description for you
but if we just query out to http local
host 3000 which if we scroll down here
that is what this server is running on
and we go to slash
photos and i click send here you can see
down here we get our response which has
a ton of information inside of as you
can see there's
essentially 35 000 lines of code inside
of here being returned
and it took about 370 milliseconds and
if i do a few more sends you can see
it's around that ballpark of about 300
to 400 milliseconds
every time i make this request and if i
get an individual photo for example
photo one click send
you can see it's quite a bit faster
because there's a lot less data but it's
still taking you know
almost 100 milliseconds for this to run
and this photos one is taking quite a
while like i said you know 300 to 400
milliseconds
now this three to four hundred
milliseconds isn't like the end of the
world but you can imagine a query that
takes much longer maybe one
two three seconds to run and if you have
to wait for that every time you load
your web page
obviously that's a terrible user
experience so instead what we're gonna
do is use redis to cache this
information
so that way whenever we make a request
after it's been cached we're going to
get it directly from redis which is
going to be way
way quicker so let me just come in here
and we're going to install redis
so i'm just going to open up a new tab
here i'm going to say npm
i redis just like that it's going to go
through it's going to install redis for
us let's go back to where we were before
now we have our application running and
we can import redis so we can say const
redis is equal to requiring of redis
and now that we have redis here this is
actually going to be essentially like a
class
that we can use so we can get an
instance of redis so we can say that we
want to get our client
which is just saying redis dot create
client and instead of here we can just
pass it nothing and it's going to use
all the default parameters
or you can pass it specifically a url so
if you're going to push this up to
production you're going to want to pass
in the url for your production instance
of redis but for our case we're just
using the local host version that's
running on the default port
so we can just leave this completely
blank and we actually have access now to
redis
so to make sure that redis is running i
have a windows terminal open up over
here for linux
i can just type in redis server and
that's going to start up redis and if we
just expand this a little bit
you can see that it's saying it started
up redis and it's saying that it's
accessible so let's just minimize that
back down a little bit let's start up
our server we'll say run
dev start here just like that so our
server is running everything's working
we have this redis client i'll even just
rename this to redis client
now in order to use this redis client
you're going to use it just like you
would use normal redis so if we come
down here we can say like red is client
dot set that's going to allow us to set
or we can say set ex and that's going to
allow us to set with an expiration time
every command i just taught you in redis
is going to be used on this redis client
here
so let's do just a simple set with an
expiration and we're going to say
for this we want to set something for
all of our photos so we're going to set
it with a key of
photos like this and we want to set an
expiration let's just say that we're
going to create a default expiration up
here so we're going to say const
default expiration is just going to be
like 3 600 seconds that's essentially
the same as one hour so there's our
default expiration
and our value for this is going to be
the value we get from right here so let
me just bring this down a little bit
and we can say that we want to store the
value of data inside of here
except for this data right here is an
array of values and inside of redis we
can only really store strings so we need
to make sure we json.stringify this
to convert this into a string to store
it inside of redis
now if we save this and we just send on
our page here what's going to happen is
nothing new is going to happen you can
see it's still taking you know quite a
while to do this command
but now we're storing our information
inside of redis with this expiration
here
and we're storing this data so what we
can do is we can essentially go over
open up a new
terminal tab here we can say redis cli
and we can just say
keys star and as you can see we have
that photos key right here which has the
value of
you know this 35 000 lines of json now
that's really great
but right now we're not actually getting
that information because every time we
run this we're just getting the data and
saving it to redis
what i want to do instead is check does
redis have this information and if so
skip essentially all of this code right
here so we can say
redis client.get and what we want to do
is we want to get to something with the
id
or with the key here of photos and then
this is going to take in a callback that
has an error
and it also has our data in our case our
data is just all of our different
photos but they're going to be as a
string so what we need to do is if we
have an
error then i just want to essentially
console
dot air out the air now the next thing i
want to do is check to see if we have
some photos
so if our photos is not equal to null
well then that means that we had some
data returned to us
so we can actually use that data to
return down to our user so we can
essentially just say here return
res.json and we want to json.parse
these photos because remember this is
returned to us as a string so if we have
photos already saved just return them
down to the user
otherwise what we want to do is we want
to get that data and we want to set it
so we want to take all the code that we
were doing every single time
and now we're only going to run that
code to query the api and actually set
the data inside of
redis if we don't already have it inside
of there and then obviously we're going
to make sure we just json that
information down
now all that we've done inside of here
is we've wrapped everything inside of
this redis client git and if we're able
to get information we return it
immediately
otherwise we go through we query our you
know database or api whatever it is
and then send the data down so now
what's going to happen is when i click
send over here
you're going to notice something
interesting it looks like when i click
send nothing works so if we come over
here you can see we have an error if i
scroll up
it's just saying that this await keyword
is not able to be used and we need to be
inside an async function so let's just
make sure this is an async function
right here
now if i save you can see we no longer
get any errors we click send
and you can see the time is now 63
milliseconds so we went from 400
milliseconds down to 60. we click send
again now we're down you know 37
milliseconds it's super super quick
and that's because we're just pulling
this directly from our redis cache
if i just put a simple console log
inside of here that says
cache it and i'm going to put another
console log inside of here that says
cache
miss so if we hit the cache and we got
it immediately it's going to print out
cache hit otherwise if we didn't we're
going to print out cache miss
as you can see we're hitting the cache
every single time that's where this
cache hit is coming from
now if we come over to here whoops to
here where we have our cli open we just
say flush all
that's going to clear out our entire
database we now no longer have
that key as you can see so if we go back
here we should see that when we first
search it's going to give us cache miss
and of course it's giving us an error
let's see what this is
just saying data is not defined we have
data here data here
data here we just need to move this
inside the else there we go that should
fix that error
so now if we just make sure we clear
that back out again let's just
whoops clear everything go back over to
here and now we click send
you're going to see said cache missed
and it took 400 milliseconds so pretty
slow
we click send again it's a cache hit and
now it only took 36 milliseconds that is
way way faster that's 10 times faster
immediately right there and we click
send every single time it's going to be
a cache hit now one problem with this
initial setup though is it doesn't work
with this album id if i add in a query
param for our album id and let's just
say we do album id of
2 and i click send you can see i still
get all the albums with id1
the album's id 87 and so on and that's
because it's still hitting this cache of
photos
we need to make sure that our cache key
takes into account everything that could
change so for example if the album id
changes
we want this key here to change so what
i would like to do here is essentially
just add in
our album id and we're going to put the
value of that album
id onto the end of our key so now our
key is for any photo that has an album
id
or doesn't have an album id the only
other thing we have left to do is make
sure we use the same key down here
where we're actually setting our redis
key so now if we save this
and we test this if we have an album id
of two click send you can see we get
only the things that the album id of two
it took about 127 milliseconds
click send again now it took six
milliseconds i mean that's way way way
faster that's like 20 30 times faster
if we do an album id of three click send
it takes a long time the first time but
every other time is incredibly quick
and if we have no album id click send it
takes a while and then every other call
after that is pretty quick and we can
actually check that by coming over here
and just saying keys star you can see
that we have a key for just photos which
is just from before our database we
didn't flush it properly
we have it for when the album ideas
three when the album id is two and then
we don't have any album id at all
so this is essentially all the different
things being cached inside of our
database
this is really great now all we have to
do is add caching down here to this
section of our application
but you'll notice when we do this that
logic is almost identical to what we've
done up inside of here
so i want to extract this out into a
function i can reuse everywhere that's
going to do the caching for me so what i
want to do is just come down all the way
here and we're going to create a
function
and we're going to call this git or set
cache
and it's going to take in a key and it's
going to take in a callback
and the callback is what we're going to
call to actually get the value for our
cache
so instead of here the first thing i
want to do is turn this into a promise
because it's much easier to work with
promises
so we're going to return a new promise
that has a resolve
whoops resolve and a reject insider here
and then we're going to use that redis
client and we're going to see if we can
get a key so we're going to try to get
to that key
and if we can't get that key we're going
to have here an error
and our data and then what i want to do
inside of here is if we have an error
then i obviously just want to reject
that error and return so we don't do
anything else at all
then i want to see if our data is not
equal to null that means we have some
data
so i want to resolve that data and i
want to make sure i convert it back
into json so we're going to json parse
this data since we're constantly
converting everything to a string to
store it inside of our database
now if neither of these are true then
that means that we don't have data
essentially we missed our cache
and what i want to do is i want to get
fresh data this either means that we
haven't queried this page yet or
it expired after this default expiration
here essentially it's just not in our
cache
so we're going to call that callback but
the important thing is this callback is
going to be asynchronous
so we're going to make sure that we
await this callback and make sure that
this here is an async function
just like that now we're going to have
our fresh data and what i want to do is
i want to take my redis client and i
want to set that fresh data so we can
use set exe
for our key we're going to use that
default expiration and we're going to
store in here our brand new fresh data
so now we're saving that inside of our
cache
so next time we can take this shortcut
and not have to worry about calling this
long running callback
and then what i want to do is just
resolve that fresh
data and it's important here that this
fresh data i convert this to a string
before i store it since redis can't
really handle
something that's not a string so now we
have this handy dandy function called
get or set cache it just takes in a key
and a callback that we call if for some
reason it doesn't work so way up here
what we can do is we can say get or set
cache
this is going to return to us
essentially some photos
it's going to be equal to that and this
is a promise so we need to make sure
that we await that
and in here we're going to pass it our
key which we can just copy from right
here
and then we need to pass it our callback
and the callback is
really super straightforward it's just
this callback down here where we're
going to be getting our data
so we're getting our data and then we
need to return that data our callback is
just
how do we get the information we want to
store in the cache and this is how we
get it and let's just make sure we
return it down here
so now i can take all this code that we
wrote right here completely get rid of
it
and down here i can just say res.json
and send back our photos
since that's what we called this
variable right up here so now if i save
this let's see if this still works
obviously we have an error saying that a
weight is only valid in an async
function
let's just make sure this is an async
function here now we have no more errors
i want to go over real quickly and just
flush everything from our database so we
have a completely fresh
redis to work with and let's click send
here and you're going to notice it takes
about 427 milliseconds
but the next time it only takes 39 it's
storing that in the cache
if we add in the album id we add an
album id of two for example
click send you can see 80 milliseconds
the first time and five the second time
so quite a bit faster
we can try the same thing with three and
you can see again it down to four
milliseconds and if we check our keys
over here
you can see we have those three
different keys for undefined two and
three so now i want to essentially do
the exact same thing i want to take this
code and i'll make it work down here
so let's just copy what we have right
here we're gonna paste it down inside of
here
and instead our data is going to be got
by this query right here where we're
just querying the api with this
particular id so we're just replacing
how we get our data with the data that
was right inside of here
and then we're going to change our key
because our key is not going to be based
on an album id
it's going to be based on an id so a lot
of times in redis when you're working
with
namespaces or with data that has you
know multiple ids or multiple entries
you just have the namespace followed by
a colon and then you can put in for
example the id which in our case is
request.params.id
so what this is saying is hey we have
some photos namespace and we're going to
get an id'd value from it
this is just a naming convention you can
use whatever you want you could put a
hyphen in here you could put an
underscore you could put nothing at all
it just is a nice thing to have here so
that we can easily say this is a photo
and the photo has you know an id of one
for example
this is going to return to us a single
photo which we're going to return as our
data down here
so now with that done we should
hopefully build a query something like
photos
slash one click send the first time it
took 126 milliseconds
and the next time it took six
milliseconds let's get photos three
you can see the first time it was slow
and the second time it's much faster
every other time after that is going to
be very very fast
and if we check our keys you can see we
have a key for photos colon one
and photos colon three which are the two
different ids that we checked for and
that is everything you need to know to
get started with
redis if you enjoyed that video and want
to figure out how i made that postman
clone
just click over here for that and also
subscribe to the channel for more videos
just like this
thank you very much for watching and
have a good day