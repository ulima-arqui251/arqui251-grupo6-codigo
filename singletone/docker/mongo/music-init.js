db = db.getSiblingDB('music');

// Función para crear un género
function createGenre(name) {
    const genreId = ObjectId();
    db.Genre.insertOne({ _id: genreId, name });
    return genreId;
}

// Función para crear un artista
function createArtist(name, pictureUrl, debutYear, genreId) {
    const artistId = ObjectId();
    db.Artist.insertOne({
        _id: artistId,
        name,
        picture_url: pictureUrl,
        debut_year: ISODate(debutYear),
        genre: genreId,
        albums: []
    });
    return artistId;
}
// Función para crear un álbum con canciones
function createAlbumWithSongs(artistId, albumData, songNames) {
    const albumId = ObjectId();
    const songIds = songNames.map(() => ObjectId());

    db.Album.insertOne({
        _id: albumId,
        title: albumData.title,
        genre: albumData.genreId,
        release_year: albumData.releaseYear,
        cover_url: albumData.coverUrl,
        songs: songIds,
        artist_id: artistId
    });

    songNames.forEach((songName, index) => {
        db.Song.insertOne({
            _id: songIds[index],
            name: songName,
            album_id: albumId,
            artist_id: artistId
        });
    });

    db.Artist.updateOne(
        { _id: artistId },
        { $push: { albums: albumId } }
    );

    return { albumId, songIds };
}

// Crear artistas
function createMultipleArtists(artistsData) {
    const results = [];

    artistsData.forEach(artistData => {
        let genreId;
        const existingGenre = db.Genre.findOne({ name: artistData.genre });
        genreId = existingGenre ? existingGenre._id : createGenre(artistData.genre);

        const artistId = createArtist(artistData.name, artistData.pictureUrl, artistData.debutYear, genreId);

        const albumResults = artistData.albums.map(albumData =>
            createAlbumWithSongs(artistId, {
                title: albumData.title,
                genreId,
                releaseYear: albumData.releaseYear,
                coverUrl: albumData.coverUrl
            }, albumData.songs)
        );

        results.push({ artistId, genreId, albums: albumResults });
    });

    return results;
}

// === Datos iniciales ===
const artistsData = [
    {
        name: "Twenty One Pilots",
        pictureUrl: "https://thepostcalvin.com/wp-content/uploads/2025/01/clancy.jpg",
        debutYear: "2009-01-01",
        genre: "Alternative Rock",
        albums: [
        {
            title: "Twenty One Pilots",
            releaseYear: "2009",
            coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ca/7a/d0/ca7ad083-e97a-de0c-a8f2-5e144662dc87/884501253109_cover.jpg/486x486bb.png",
            songs: [
            "Implicit Demand for Proof", "Fall Away", "The Pantaloon",
            "Addict With a Pen", "Friend, Please", "March to the Sea",
            "Johnny Boy", "Oh Ms Believer", "Air Catcher",
            "Trapdoor", "A Car, a Torch, a Death", "Taxi Cab",
            "Before You Start Your Day", "Isle of Flightless Birds"
            ]
        },
        {
            title: "Regional at Best",
            releaseYear: "2011",
            coverUrl: "https://lastfm.freetls.fastly.net/i/u/ar0/20a1fe31863658a168cccac6b419e99f.jpg",
            songs: [
            "Guns for Hands", "Holding On to You", "Ode to Sleep",
            "Slowtown", "Car Radio", "Forest", "Glowing Eyes",
            "Kitchen Sink", "Anathema", "Lovely", "Ruby", "Trees"
            ]
        },
        {
            title: "Vessel",
            releaseYear: "2013",
            coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/73/a7/23/73a7230c-19df-02a4-ff4e-53944024f63d/075679957924.jpg/600x600bf-60.jpg",
            songs: [
            "Ode to Sleep", "Holding On to You", "Migraine",
            "House of Gold", "Car Radio", "Semi-Automatic",
            "Screen", "The Run and Go", "Fake You Out",
            "Guns for Hands", "Trees", "Truce"
            ]
        },
        {
            title: "Blurryface",
            releaseYear: "2015",
            coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/8e/e2/89/8ee28904-0821-610d-5011-a61845f62756/075679926951.jpg/600x600bf-60.jpg",
            songs: [
            "Heavydirtysoul", "Stressed Out", "Ride", "Fairly Local",
            "Tear in My Heart", "Lane Boy", "The Judge", "Doubt",
            "Polarize", "We Don't Believe What's on TV", "Message Man",
            "Hometown", "Not Today", "Goner"
            ]
        },
        {
            title: "Trench",
            releaseYear: "2018",
            coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a3/c0/2b/a3c02b76-baa1-e575-dcba-247509200424/075679864789.jpg/600x600bf-60.jpg",
            songs: [
            "Jumpsuit", "Levitate", "Morph", "My Blood",
            "Chlorine", "Smithereens", "Neon Gravestones",
            "The Hype", "Nico and the Niners", "Cut My Lip",
            "Bandito", "Pet Cheetah", "Legend", "Leave the City"
            ]
        },
        {
            title: "Scaled and Icy",
            releaseYear: "2021",
            coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/24/f2/15/24f215e3-52cc-078b-d799-d58d606feddd/075679786210.jpg/600x600bf-60.jpg",
            songs: [
            "Good 4 U", "Choker", "Shy Away", "The Outside",
            "Saturday", "Never Take It", "Mulberry Street",
            "Formidable", "Bounce Man", "No Chances", "Redecorate"
            ]
        },
        {
            title: "Clancy",
            releaseYear: "2024",
            coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/8b/39/c6/8b39c655-00fd-1b52-52ea-a98de686f3ae/075679659729.jpg/600x600bf-60.jpg",
            songs: [
            "Overcompensate", "Next Semester", "Backslide",
            "Midwest Indigo", "Routines In The Night", "Vignette",
            "The Craving (Jenna's Version)", "Lavish", "Navigating",
            "Snap Back", "Oldies Station", "At The Risk Of Feeling Dumb",
            "Paladin Strait"
            ]
        }
        ]
    },
    {
        name: "Imagine Dragons",
        pictureUrl: "https://cdn-images.dzcdn.net/images/artist/1ba025c23cae3dee14b51152990285fc/1900x1900-000000-80-0-0.jpg",
        debutYear: "2008-01-01",
        genre: "Pop Rock",
        albums: [
            {
                title: "Night Visions",
                releaseYear: "2012",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/1f/fa/09/1ffa092f-f52f-4a66-7d10-4cc5982dc747/12UMGIM46901.rgb.jpg/600x600bf-60.jpg",
                songs: [
                    "Radioactive", "Tiptoe", "It's Time", "Demons",
                    "On Top of the World", "Amsterdam", "Hear Me",
                    "Every Night", "Bleeding Out", "Underdog",
                    "Nothing Left to Say", "Rocks", "Cha-Ching", "Working Man", "Fallen"
                ]
            },
            {
                title: "Smoke + Mirrors",
                releaseYear: "2015",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/c1/16/59/c116596f-f3fd-3499-6cc2-bcb5b4931e6e/14UMGIM61459.rgb.jpg/600x600bf-60.jpg",
                songs: [
                    "Shots", "Gold", "Smoke and Mirrors", "I'm So Sorry",
                    "I Bet My Life", "Polaroid", "Friction", "It Comes Back to You",
                    "Dream", "Trouble", "Summer", "Hopeless Opus", "The Fall"
                ]
            },
            {
                title: "Evolve",
                releaseYear: "2017",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/11/7a/b8/117ab805-6811-8929-18b9-0fad7baf0c25/17UMGIM98210.rgb.jpg/600x600bf-60.jpg",
                songs: [
                    "Next to Me", "I Don't Know Why", "Whatever It Takes", "Believer",
                    "Walking the Wire", "Rise Up", "I'll Make It Up to You",
                    "Yesterday", "Mouth of the River", "Thunder", "Start Over", "Dancing in the Dark"
                ]
            },
            {
                title: "Origins",
                releaseYear: "2018",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/ae/99/b0/ae99b033-76aa-580c-f6b0-2d374e89763d/18UMGIM65849.rgb.jpg/600x600bf-60.jpg",
                songs: [
                    "Natural", "Boomerang", "Machine", "Cool Out",
                    "Bad Liar", "West Coast", "Zero", "Bullet in a Gun",
                    "Digital", "Only", "Stuck", "Love"
                ]
            },
            {
                title: "Mercury – Act 1",
                releaseYear: "2021",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/12/1d/a0/121da03f-2938-12d1-65b5-5d18c752ffaf/21UMGIM58932.rgb.jpg/600x600bf-60.jpg",
                songs: [
                    "My Life", "Lonely", "Wrecked", "Monday",
                    "#1", "Easy Come Easy Go", "Giants", "It's Ok",
                    "Dull Knives", "Follow You", "Cutthroat", "No Time For Toxic People", "One Day"
                ]
            },
            {
                title: "Mercury – Act 2",
                releaseYear: "2022",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/2d/54/70/2d5470e7-ab60-f062-7ac8-e950e9726cba/22UMGIM37171.rgb.jpg/600x600bf-60.jpg",
                songs: [
                    "Bones", "Symphony", "Sharks", "I Don't Like Myself",
                    "Blur", "Higher Ground", "Crushed", "Take It Easy",
                    "Waves", "I'm Happy", "Ferris Wheel", "Peace of Mind", "Sirens", "Tiend", "Younger",
                    "I Wish", "Continual", "They Don't Jnow You Like I Do"
                ]
            },
            {
                title: "Loom",
                releaseYear: "2024",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/11/ad/84/11ad84d7-2baa-cfe8-6616-02e7045d7ab0/24UMGIM43945.rgb.jpg/600x600bf-60.jpg",
                songs: [
                    "Wake Up", "Nice to Meet You", "Eyes Closed",
                    "Take Me to the Beach", "In Your Corner", "Gods Don't Pray",
                    "Don't Forget Me", "Kid", "Fire in These Hills"
                ]
            }
        ]
    },
    {
        name: "My Chemical Romance",
        pictureUrl: "https://m.media-amazon.com/images/M/MV5BYmQwMTM1MTgtNDBhMy00ODY4LWFjOWItYzU4MGZkNmNhYzNiXkEyXkFqcGc@._V1_.jpg",
        debutYear: "2001-01-01",
        genre: "Alternative Rock",
        albums: [
            {
                title: "I Brought You My Bullets, You Brought Me Your Love",
                releaseYear: "2002",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/b7/3b/7f/b73b7f6a-a12e-3f70-ad2e-4620cad5bb9a/093624915256.jpg/600x600bf-60.jpg",
                songs: [
                    "Romance", "Honey, This Mirror Isn't Big Enough for the Two of Us",
                    "Vampires Will Never Hurt You", "Drowning Lessons",
                    "Our Lady of Sorrows", "Headfirst for Halos",
                    "Skylines and Turnstiles", "Early Sunsets Over Monroeville",
                    "This Is the Best Day Ever", "Cubicles", "Demolition Lovers"
                ]
            },
            {
                title: "Three Cheers for Sweet Revenge",
                releaseYear: "2004",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/42/58/f7/4258f7bb-eb5b-62b8-573d-6200df0fe3e1/093624917731.jpg/1200x630bb.jpg",
                songs: [
                    "Helena", "Give 'Em Hell, Kid", "To the End",
                    "You Know What They Do to Guys Like Us in Prison",
                    "I'm Not Okay (I Promise)", "The Ghost of You",
                    "The Jetset Life Is Gonna Kill You", "Interlude",
                    "Thank You for the Venom", "Hang 'Em High", "It's Not a Fashion Statement, It's a Deathwish",
                    "Cemetery Drive", "I Never Told You What I Do for a Living"
                ]
            },
            {
                title: "The Black Parade",
                releaseYear: "2006",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/56/99/8a/56998a1c-efe7-fdf0-2b1d-e2da88d8df52/093624917724.jpg/1200x630bb.jpg",
                songs: [
                    "The End", "Dead!", "This Is How I Disappear",
                    "The Sharpest Lives", "Welcome to the Black Parade",
                    "I Don't Love You", "House of Wolves", "Cancer",
                    "Mama", "Sleep", "Teenagers", "Disenchanted", "Famous Last Words"
                ]
            },
            {
                title: "Danger Days: The True Lives of the Fabulous Killjoys",
                releaseYear: "2010",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music62/v4/d6/05/61/d60561a5-8c82-2db1-bdde-84e582aa2a9b/093624917717.jpg/600x600bf-60.jpg",
                songs: [
                    "Look Alive, Sunshine", "Na Na Na (Na Na Na Na Na Na Na Na Na)",
                    "Bulletproof Heart", "SING", "Planetary (GO!)",
                    "The Only Hope for Me Is You", "Jet Star and the Kobra Kid/Traffic Report",
                    "Party Poison", "Save Yourself, I'll Hold Them Back",
                    "S/C/A/R/E/C/R/O/W", "Summertime", "DESTROYA",
                    "The Kids from Yesterday", "Goodnite, Dr. Death", "Vampire Money"
                ]
            }
        ]
    },
    {
        name: "Arctic Monkeys",
        pictureUrl: "https://indievalleymusic.com/wp-content/uploads/2024/05/ab6761610000e5eb7da39dea0a72f581535fb11f.jpeg",
        debutYear: "2002-01-01",
        genre: "Indie Rock",
        albums: [
            {
                title: "Whatever People Say I Am, That's What I'm Not",
                releaseYear: "2006",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/cf/9b/96/cf9b9637-f619-eceb-5382-e9b4d44e74fb/dj.npwkgmai.jpg/1200x630bb.jpg",
                songs: [
                    "The View from the Afternoon", "I Bet You Look Good on the Dancefloor",
                    "Fake Tales of San Francisco", "Dancing Shoes",
                    "You Probably Couldn't See for the Lights but You Were Staring Straight at Me",
                    "Still Take You Home", "Riot Van", "Red Light Indicates Doors Are Secured",
                    "Mardy Bum", "Perhaps Vampires Is a Bit Strong But...",
                    "When the Sun Goes Down", "From the Ritz to the Rubble", "A Certain Romance"
                ]
            },
            {
                title: "Favourite Worst Nightmare",
                releaseYear: "2007",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/82/90/14/829014ad-a301-62ab-bee6-f4cca4457411/mzi.hozudery.jpg/600x600bf-60.jpg",
                songs: [
                    "Brianstorm", "Teddy Picker", "D Is for Dangerous",
                    "Balaclava", "Fluorescent Adolescent", "Only Ones Who Know",
                    "Do Me a Favour", "This House Is a Circus", "If You Were There, Beware",
                    "The Bad Thing", "Old Yellow Bricks", "505"
                ]
            },
            {
                title: "Humbug",
                releaseYear: "2009",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/4a/07/92/4a0792a5-03c9-10d8-a60c-94fa8bb6508a/mzi.nlrajrgr.jpg/1200x630bb.jpg",
                songs: [
                    "My Propeller", "Crying Lightning", "Dangerous Animals",
                    "Secret Door", "Potion Approaching", "Fire and the Thud",
                    "Cornerstone", "Dance Little Liar", "Pretty Visitors", "The Jeweller's Hands"
                ]
            },
            {
                title: "Suck It and See",
                releaseYear: "2011",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Features/62/5b/66/dj.wlpuxxqn.jpg/600x600bf-60.jpg",
                songs: [
                    "She's Thunderstorms", "Black Treacle", "Brick by Brick",
                    "The Hellcat Spangled Shalalala", "Don't Sit Down 'Cause I've Moved Your Chair",
                    "Library Pictures", "All My Own Stunts", "Reckless Serenade",
                    "Piledriver Waltz", "Love Is a Laserquest", "Suck It and See", "That's Where You're Wrong"
                ]
            },
            {
                title: "AM",
                releaseYear: "2013",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/cc/0f/2d/cc0f2d02-5ff1-10e7-eea2-76863a55dbad/887828031795.png/600x600bf-60.jpg",
                songs: [
                    "Do I Wanna Know?", "R U Mine?", "One for the Road",
                    "Arabella", "I Want It All", "No. 1 Party Anthem",
                    "Mad Sounds", "Fireside", "Why'd You Only Call Me When You're High?",
                    "Snap Out of It", "Knee Socks", "I Wanna Be Yours"
                ]
            },
            {
                title: "Tranquility Base Hotel & Casino",
                releaseYear: "2018",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/f3/ac/06/f3ac06b3-9217-adc8-cc33-8e930293e495/887835044184.png/600x600bf-60.jpg",
                songs: [
                    "Star Treatment", "One Point Perspective", "American Sports",
                    "Tranquility Base Hotel & Casino", "Golden Trunks",
                    "Four Out of Five", "The World's First Ever Monster Truck Front Flip",
                    "Science Fiction", "She Looks Like Fun", "Batphone", "The Ultracheese"
                ]
            },
            {
                title: "The Car",
                releaseYear: "2022",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/0f/03/0f/0f030fb9-a529-dba5-4e9d-4fbf2ed25037/887828045563.png/600x600bf-60.jpg",
                songs: [
                    "There'd Better Be a Mirrorball", "I Ain't Quite Where I Think I Am",
                    "Sculptures of Anything Goes", "Jet Skis on the Moat",
                    "Body Paint", "The Car", "Big Ideas", "Hello You", "Mr Schwartz", "Perfect Sense"
                ]
            }
        ]
    },
    {
        name: "Coldplay",
        pictureUrl: "https://lumiere-a.akamaihd.net/v1/images/coldplay_en_chile_2022_45e7eeb2.jpeg",
        debutYear: "1996-01-01",
        genre: "Alternative Rock",
        albums: [
            {
                title: "Parachutes",
                releaseYear: "2000",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f5/93/8c/f5938c49-964c-31d1-4b33-78b634f71fb7/190295978075.jpg/600x600bf-60.jpg",
                songs: [
                    "Don't Panic", "Shiver", "Spies", "Sparks",
                    "Yellow", "Trouble", "Parachutes", "High Speed",
                    "We Never Change", "Everything's Not Lost"
                ]
            },
            {
                title: "A Rush of Blood to the Head",
                releaseYear: "2002",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b9/b4/2a/b9b42ad1-1e25-5096-da43-497a247e69a3/190295978051.jpg/600x600bf-60.jpg",
                songs: [
                    "Politik", "In My Place", "God Put a Smile upon Your Face",
                    "The Scientist", "Clocks", "Daylight", "Green Eyes",
                    "Warning Sign", "A Whisper", "A Rush of Blood to the Head", "Amsterdam"
                ]
            },
            {
                title: "X&Y",
                releaseYear: "2005",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0c/82/48/0c8248a8-4a5b-d30d-8056-f32d650d2fc9/190295978068.jpg/600x600bf-60.jpg",
                songs: [
                    "Square One", "What If", "White Shadows", "Fix You",
                    "Talk", "X&Y", "Speed of Sound", "A Message",
                    "Low", "The Hardest Part", "Swallowed in the Sea", "Twisted Logic", "Til Kingdom Come"
                ]
            },
            {
                title: "Viva la Vida or Death and All His Friends",
                releaseYear: "2008",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/52/aa/85/52aa851f-15b7-6322-f91f-df84b15b7b19/190295978044.jpg/600x600bf-60.jpg",
                songs: [
                    "Life in Technicolor", "Cemeteries of London", "Lost!",
                    "42", "Lovers in Japan", "Yes", "Viva la Vida",
                    "Violet Hill", "Strawberry Swing", "Death and All His Friends"
                ]
            },
            {
                title: "Mylo Xyloto",
                releaseYear: "2011",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/fa/41/1c/fa411c37-7a65-8a3e-71c9-4b566c49617c/5099967983858_1562x1562_300dpi.jpg/600x600bf-60.jpg",
                songs: [
                    "Mylo Xyloto", "Hurts Like Heaven", "Paradise",
                    "Charlie Brown", "Us Against the World", "M.M.I.X.",
                    "Every Teardrop Is a Waterfall", "Major Minus", "U.F.O.",
                    "Princess of China", "Up in Flames", "A Hopeful Transmission",
                    "Don't Let It Break Your Heart", "Up with the Birds"
                ]
            },
            {
                title: "Ghost Stories",
                releaseYear: "2014",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/60/90/ad/6090adc3-8863-861d-afcc-23c55c6fe5da/dj.vmtulfyu.jpg/600x600bf-60.jpg",
                songs: [
                    "Always in My Head", "Magic", "Ink", "True Love",
                    "Midnight", "Another's Arms", "Oceans", "A Sky Full of Stars", "O"
                ]
            },
            {
                title: "A Head Full of Dreams",
                releaseYear: "2015",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/c8/0a/6d/c80a6df9-e55a-fb83-0311-f4776984ac67/mzm.lasidxkv.jpg/600x600bf-60.jpg",
                songs: [
                    "A Head Full of Dreams", "Birds", "Hymn for the Weekend",
                    "Everglow", "Adventure of a Lifetime", "Fun",
                    "Kaleidoscope", "Army of One", "Amazing Day", "Colour Spectrum", "Up&Up"
                ]
            },
            {
                title: "Everyday Life",
                releaseYear: "2019",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/fe/d8/c7/fed8c788-78b5-68c6-ec42-6874d4039d4c/190295323929.jpg/1200x630bb.jpg",
                songs: [
                    "Sunrise", "Church", "Trouble in Town", "BrokEn",
                    "Daddy", "WOTW/POTP", "Arabesque", "When I Need a Friend",
                    "Guns", "Orphans", "Eko", "Cry Cry Cry", "Old Friends", "بنی آدم", "Champion of the World", "Everyday Life"
                ]
            },
            {
                title: "Music of the Spheres",
                releaseYear: "2021",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/df/60/00/df600071-c5c7-24e7-e4d7-1a6b71fa44e7/190296529818.jpg/600x600bf-60.jpg",
                songs: [
                    "Music Of The Spheres", "Higher Power", "Humankind",
                    "Alien Choir", "Let Somebody Go", "Human Heart",
                    "People Of The Pride", "Biutyful", "Music Of The Spheres II", "My Universe", "Infinity Sign", "Coloratura"
                ]
            },
            {
                title: "Moon Music",
                releaseYear: "2024",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/af/3c/0f/af3c0fe2-1c4f-8499-67a8-14a8e41fdbf8/5021732410535.jpg/600x600bf-60.jpg",
                songs: [
                    "Moon Music", "feelslikeimjustmissin", "WE PRAY",
                    "Jupiter", "Good Feelings", "Alien Hits/Alien Radio",
                    "iAAM", "AETERNA", "All My Love", "One World"
                ]
            }
        ]
    },
    {
        name: "Mother Mother",
        pictureUrl: "https://revistaswitch.com/wp-content/uploads/2024/04/Mother-Mother-Destacada.jpeg",
        debutYear: "2005-01-01",
        genre: "Indie Rock",
        albums: [
            {
                title: "Touch Up",
                releaseYear: "2007",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/25/38/b2/2538b2d4-86ba-3f18-28b0-f6e8e5b3a036/2986.jpg/1200x630bb.jpg",
                songs: [
                    "Dirty Town", "Polynesia", "Angre Sea", "Oh Ana",
                    "Legs Away", "Love and Truth", "Train of Thought",
                    "Verbatim", "Neighbour", "Ball Cap", "Tic Toc",
                    "Touch Up", "Little Hands"
                ]
            },
            {
                title: "O My Heart",
                releaseYear: "2008",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/17/0e/f9/170ef9de-00ac-21c6-d8de-d4ecb7755f21/060270082120.jpg/600x600bf-60.jpg",
                songs: [
                    "O My Heart", "Burning Pile", "Body of Years",
                    "Try to Chance", "Wisdom", "Body", "Ghosting",
                    "Hayloft", "Wrecking Ball", "Arms Tonite", "Miles",
                    "Sleep Awake"
                ]
            },
            {
                title: "Eureka",
                releaseYear: "2011",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music60/v4/7d/47/e3/7d47e38d-b34c-34ce-e1b3-94cc07f803ff/060270129924.jpg/600x600bf-60.jpg",
                songs: [
                    "Chasing It Down", "The Stand", "Baby Don't Dance",
                    "Original Spin", "Born In a Flash", "Simply Simple",
                    "Problems", "Aspiring Fires", "Getaway", "Far in Time",
                    "Oleader", "Calm Me Down", "In the Wings", "Carve a Name"
                ]
            },
            {
                title: "The Sticks",
                releaseYear: "2012",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/1d/15/78/1d1578c0-d725-30f3-c673-9e9da66ad096/060270141124.jpg/600x600bf-60.jpg",
                songs: [
                    "Omen", "The Sticks", "Let's Fall In Love", "Business Man",
                    "Dread in My Heart", "Ifinitesimal", "Happy",
                    "Bit By Bit", "Latter Days", "Little Pistol",
                    "Love It Dissipates", "The Cry Forum", "Waiting For the World To End",
                    "To the Wild", "Cesspool of Love", "All Gone"
                ]
            },
            {
                title: "Very Good Bad Thing",
                releaseYear: "2014",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/e5/f2/2e/e5f22ef5-d514-8dd2-7c7b-2c74e2180cd7/00602547107558.rgb.jpg/600x600bf-60.jpg",
                songs: [
                    "Get Out the Way", "Monkey Tree", "Modern Love", "Reaper Man",
                    "I Go Hungry", "Have It Out", "Very Good Bad Thing", "Keep Down",
                    "Shout If You Know", "Alone and Sublime"
                ]
            },
            {
                title: "No Culture",
                releaseYear: "2017",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/5f/e3/6f/5fe36f82-98e2-a7e3-6f62-5fa31bd021ea/00602557273243.rgb.jpg/600x600bf-60.jpg",
                songs: [
                    "Free", "Love Stuck", "The Drugs",
                    "Backn In School", "Letter", "Baby Boy",
                    "Mouth of the Devil", "No Culture",
                    "Everything is Happening", "Family"
                ]
            },
            {
                title: "Dance and Cry",
                releaseYear: "2018",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/e3/ad/40/e3ad4011-9c20-16bc-deaf-9cc99f988602/00602577208584.rgb.jpg/600x600bf-60.jpg",
                songs: [
                    "I Must Cry Out Loud", "Dance and Cry", "Get Up",
                    "So Down", "Good at Loving You", "Biting on a Rose",
                    "It's Alright", "Give Me Back the Night",
                    "Back to Life", "Only Love", "Bottom Is a Rock", "Kepp"
                ]
            },
            {
                title: "Inside",
                releaseYear: "2022",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/77/bf/00/77bf0029-459c-f189-f600-7f3d10d9643e/190296354748.jpg/1200x1200bf-60.jpg",
                songs: [
                    "Seven", "Two", "Sick of The Silence", "Forgotten Souls",
                    "Pure Love", "Weep", "I Got Love", "Stay Behind", "The Knack",
                    "Girl Alone", "Like a Child", "Breathe", "Until It Doesn't Hurt"
                ]
            },
            {
                title: "Grief Chapter",
                releaseYear: "2024",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/13/39/5f/13395f21-7e8c-94e2-8c5c-ae3e3fe41f48/5054197818776.jpg/1200x1200bb.jpg",
                songs: [
                    "Nobody Escapes", "To My Heart", "Explode!",
                    "Head Shrink", "Days", "Forever", "Normalize",
                    "Goddamn Staying Power", "The Matrix", "God's Plan",
                    "End of Me", "Grief Chapter"
                ]
            },
            {
                title: "Nostalgia",
                releaseYear: "2025",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/72/f1/25/72f12557-ece1-f6c9-a629-5611b8aaa51b/5021732624840.jpg/1200x630bb.jpg",
                songs: [
                    "Love to Death", "Make Believe", "Station Wagon",
                    "ON AND ON", "Better of Me", "Namaste", "FINGER",
                    "Me & You", "little mistake", "Mano a Mano", "Nostalgia",
                    "To Regret"
                ]
            }
        ]
    },
    {
        name: "Glass Animals",
        pictureUrl: "https://www.billboard.com/wp-content/uploads/2024/07/Glass-Animals-pr-cr-Lillie-Eiger-2024-billboard-1548.jpg",
        debutYear: "2010-01-01",
        genre: "Indie Pop",
        albums: [
            {
                title: "Zaba",
                releaseYear: "2014",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/fd/46/47/fd464715-c290-3060-8346-346746c411ee/00602537776962.rgb.jpg/600x600bf-60.jpg",
                songs: [
                    "Flip", "Black Mambo", "Pools", "Gooey",
                    "Walla Walla", "Intruxx",
                    "Hazey", "Toes", "Wyrd", "Cocoa Hooves", "Jdnt"
                ]
            },
            {
                title: "How to Be a Human Being",
                releaseYear: "2016",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/1b/9b/1f/1b9b1f9c-19ba-b985-3e79-59581f6e88fa/16UMGIM28974.rgb.jpg/600x600bf-60.jpg",
                songs: [
                    "Life Itself", "Youth", "Season 2 Episode 3",
                    "Pork Soda", "Mama's Gun", "Cane Shuga",
                    "The Other Side of Paradise", "Take a Slice", "Poplar St", "Agnes"
                ]
            },
            {
                title: "Dreamland",
                releaseYear: "2020",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/da/8b/77/da8b7731-6f4f-eacf-5e74-8b23389eefa1/20UMGIM03371.rgb.jpg/600x600bf-60.jpg",
                songs: [
                    "Dreamland", "Tangerine", "Hot Sugar", "Space Ghost Coast to Coast",
                    "Tokyo Drifting", "Melon and the Coconut", "Your Love (Déjà Vu)",
                    "Waterfalls Coming Out Your Mouth", "It's All So Incredibly Loud",
                    "Domestic Bliss", "Heat Waves", "Helium"
                ]
            },
            {
                title: "I Love You So F***ing Much",
                releaseYear: "2024",
                coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/cd/57/49/cd574928-97af-234b-2099-539262e163ce/24UMGIM27646.rgb.jpg/600x600bf-60.jpg",
                songs: [
                    "Show Pony", "whatthehellishappening?", "Creature in Heaven",
                    "Wonderful Nothing", "A Tear in Space (Airlock)", "I Can't Make You Fall in Love Again",
                    "How I Learned to Love the Bomb", "White Roses",
                    "On the Run", "Lost in the Ocean"
                ]
            }
        ]
    },
    {
    "name": "Billie Eilish",
    "pictureUrl": "https://i.pinimg.com/736x/d8/cd/4f/d8cd4f9780ce7d493892f3d614db10e6.jpg",
    "debutYear": "2015-01-01",
    "genre": "Pop",
    "albums": [
        {
            "title": "dont smile at me",
            "releaseYear": "2017",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/02/1d/30/021d3036-5503-3ed3-df00-882f2833a6ae/17UM1IM17026.rgb.jpg/600x600bf-60.jpg",
            "songs": [
            "COPYCAT", "idontwannabeyouanymore", "my boy", "watch", "party favor", "bellyache", "ocean eyes", "hostage", "&burn"
            ]
        },
        {
            "title": "WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?",
            "releaseYear": "2019",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/1a/37/d1/1a37d1b1-8508-54f2-f541-bf4e437dda76/19UMGIM05028.rgb.jpg/600x600bf-60.jpg",
            "songs": [
            "!!!!!!!!", "bad guy", "xanny", "you should see me in a crown", "all the good girls go to hell", "wish you were gay", "when the party's over", "8", "my strange addiction", "bury a friend", "ilomilo", "listen before i go", "i love you", "goodbye"
            ]
        },
        {
            "title": "Happier Than Ever",
            "releaseYear": "2021",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/2d/f3/c9/2df3c9fd-e0eb-257c-c035-b04f05a66580/21UMGIM36691.rgb.jpg/600x600bf-60.jpg",
            "songs": [
            "Getting Older", "I Didn't Change My Number", "Billie Bossa Nova", "my future", "Oxytocin", "GOLDWING", "Lost Cause", "Halley's Comet", "Not My Responsibility", "OverHeated", "Everybody Dies", "Your Power", "NDA", "Therefore I Am", "Happier Than Ever", "Male Fantasy"
            ]
        },
        {
            "title": "HIT ME HARD AND SOFT",
            "releaseYear": "2024",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/92/9f/69/929f69f1-9977-3a44-d674-11f70c852d1b/24UMGIM36186.rgb.jpg/600x600bf-60.jpg",
            "songs": [
            "SKINNY", "LUNCH", "CHIHIRO", "BIRDS OF A FEATHER", "WILDFLOWER", "THE GREATEST", "L'AMOUR DE MA VIE", "THE DINER", "BITTERSUITE", "BLUE"
            ]
        }
        ]
    },
    {
        "name": "Linkin Park",
        "pictureUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/LPLogo-black.svg/2048px-LPLogo-black.svg.png",
        "debutYear": "1996-01-01",
        "genre": "Nu Metal",
        "albums": [
        {
            "title": "Hybrid Theory",
            "releaseYear": "2000",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Features115/v4/f0/31/b2/f031b2b2-bcf0-6102-426f-e0b2c7437415/dj.vrgpwamf.jpg/600x600bf-60.jpg",
            "songs": [
            "Papercut", "One Step Closer", "With You", "Points of Authority", "Crawling", "Runaway", "By Myself", "In the End", "A Place for My Head", "Forgotten", "Cure for the Itch", "Pushing Me Away"
            ]
        },
        {
            "title": "Meteora",
            "releaseYear": "2003",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/dd/7d/72/dd7d7259-d27f-5b3e-ce64-9e304d2cb40f/dj.rxzrauer.jpg/600x600bf-60.jpg",
            "songs": [
            "Foreword", "Don't Stay", "Somewhere I Belong", "Lying from You", "Hit the Floor", "Easier to Run", "Faint", "Figure.09", "Breaking the Habit", "From the Inside", "Nobody's Listening", "Session", "Numb"
            ]
        },
        {
            "title": "Minutes to Midnight",
            "releaseYear": "2007",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Features/v4/a4/79/73/a479733b-940e-a627-0b83-235bdd24d715/dj.oyjmpqvq.jpg/600x600bf-60.jpg",
            "songs": [
            "Wake", "Given Up", "Leave Out All the Rest", "Bleed It Out", "Shadow of the Day", "What I've Done", "Hands Held High", "No More Sorrow", "Valentine's Day", "In Between", "In Pieces", "The Little Things Give You Away"
            ]
        },
        {
            "title": "A Thousand Suns",
            "releaseYear": "2010",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/3c/07/96/3c07965d-a7f1-3c31-02e6-1abc9861c30d/093624961680.jpg/600x600bf-60.jpg",
            "songs": [
            "The Requiem", "The Radiance", "Burning in the Skies", "Empty Spaces", "When They Come for Me", "Robot Boy", "Jornada del Muerto", "Waiting for the End", "Blackout", "Wretches and Kings", "Wisdom, Justice, and Love", "Iridescent", "Fallout", "The Catalyst", "The Messenger"
            ]
        },
        {
            "title": "Living Things",
            "releaseYear": "2012",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Features115/v4/ae/96/55/ae965544-a29d-5355-910a-1cc14dab7542/contsched.ltemslzy.jpg/600x600bf-60.jpg",
            "songs": [
            "Lost in the Echo", "In My Remains", "Burn It Down", "Lies Greed Misery", "I'll Be Gone", "Castle of Glass", "Victimized", "Roads Untraveled", "Skin to Bone", "Until It Breaks", "Tinfoil", "Powerless"
            ]
        },
        {
            "title": "The Hunting Party",
            "releaseYear": "2014",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/2e/d4/0c/2ed40c04-6385-5dec-21bc-37eda2e09cff/093624936602.jpg/600x600bf-60.jpg",
            "songs": [
            "Keys to the Kingdom", "All for Nothing", "Guilty All the Same", "The Summoning", "War", "Wastelands", "Until It's Gone", "Rebellion", "Mark the Graves", "Drawbar", "Final Masquerade", "A Line in the Sand"
            ]
        },
        {
            "title": "One More Light",
            "releaseYear": "2017",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/de/b4/76/deb4760b-1733-d09f-8ab5-3da9381d5080/093624913214.jpg/600x600bf-60.jpg",
            "songs": [
            "Nobody Can Save Me", "Good Goodbye", "Talking to Myself", "Battle Symphony", "Invisible", "Heavy", "Sorry for Now", "Halfway Right", "One More Light", "Sharp Edges"
            ]
        },
        {
            "title": "From Zero",
            "releaseYear": "2024",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/69/21/cf/6921cff3-7074-118a-ece2-4012450e6c75/093624839811.jpg/1200x630bb.jpg",
            "songs": [
            "From Zero (Intro)", "The Emptiness Machine", "Cut the Bridge", "Heavy Is the Crown", "Over Each Other", "Casualty", "Overflow", "Two Faced", "Stained", "IGYEIH", "Good Things Go"
            ]
        }
        ]
    },
    {
        "name": "Gorillaz",
        "pictureUrl": "https://media.revistagq.com/photos/5ca5f4d3267a322393724870/4:3/w_1864,h_1398,c_limit/gorillaz_425.jpg",
        "debutYear": "1998-01-01",
        "genre": "Alternative Hip Hop",
        "albums": [
        {
            "title": "Gorillaz",
            "releaseYear": "2001",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/5b/8d/47/5b8d47da-71ea-93ab-dffc-733f11332659/825646290703.jpg/600x600bf-60.jpg",
            "songs": [
            "Re-Hash", "5/4", "Tomorrow Comes Today", "New Genius (Brother)", "Clint Eastwood", "Man Research (Clapper)", "Punk", "Sound Check (Gravity)", "Double Bass", "Rock the House", "19-2000", "Latin Simone (Que Pasa Contigo)", "Starshine", "Slow Country", "M1 A1"
            ]
        },
        {
            "title": "Demon Days",
            "releaseYear": "2005",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/1c/0f/81/1c0f818a-e458-dd84-6f1b-ccbdf5fe14d6/825646291045.jpg/600x600bf-60.jpg",
            "songs": [
            "Intro", "Last Living Souls", "Kids with Guns", "O Green World", "Dirty Harry", "Feel Good Inc.", "El Mañana", "Every Planet We Reach Is Dead", "November Has Come", "All Alone", "White Light", "DARE", "Fire Coming Out of the Monkey's Head", "Don't Get Lost in Heaven", "Demon Days"
            ]
        },
        {
            "title": "Plastic Beach",
            "releaseYear": "2010",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/b8/f9/b9/b8f9b9f8-a609-bde2-0302-349436ffc508/825646291038.jpg/600x600bf-60.jpg",
            "songs": [
            "Orchestral Intro", "Welcome to the World of the Plastic Beach", "White Flag", "Rhinestone Eyes", "Stylo", "Superfast Jellyfish", "Empire Ants", "Glitter Freeze", "Some Kind of Nature", "On Melancholy Hill", "Broken", "Sweepstakes", "Plastic Beach", "To Binge", "Cloud of Unknowing", "Pirate Jet"
            ]
        },
        {
            "title": "Humanz",
            "releaseYear": "2017",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/59/cd/b0/59cdb036-be24-a2ae-5c50-12e79acb7aa4/190295824853.jpg/600x600bf-60.jpg",
            "songs": [
            "Intro: I Switched My Robot Off", "Ascension", "Strobelite", "Saturnz Barz", "Momentz", "Interlude: The Non-conformist Oath", "Submission", "Charger", "Interlude: Elevator Going Up", "Andromeda", "Busted and Blue", "Interlude: Talk Radio", "Carnival", "Let Me Out", "Interlude: Penthouse", "Sex Murder Party", "She's My Collar", "Interlude: The Elephant", "Hallelujah Money", "We Got the Power"
            ]
        },
        {
            "title": "The Now Now",
            "releaseYear": "2018",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/c8/a2/c0/c8a2c0cc-28e9-c0c6-f425-f6aaf13191f4/190295620660.jpg/1200x630bb.jpg",
            "songs": [
            "Humility", "Tranz", "Hollywood", "Kansas", "Sorcererz", "Idaho", "Lake Zurich", "Magic City", "Fire Flies", "One Percent", "Souk Eye"
            ]
        },
        {
            "title": "Song Machine, Season One: Strange Timez",
            "releaseYear": "2020",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/01/d6/6e/01d66e09-0bcc-c560-469b-f6f3af6124b6/190295143152.jpg/600x600bf-60.jpg",
            "songs": [
            "Strange Timez", "The Valley of the Pagans", "The Lost Chord", "Pac-Man", "Chalk Tablet Towers", "The Pink Phantom", "Aries", "Friday 13th", "Dead Butterflies", "Désolé", "Momentary Bliss"
            ]
        },
        {
            "title": "Cracker Island",
            "releaseYear": "2023",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/b3/b9/bb/b3b9bbdf-8d38-661e-f70b-2eb5e9765bb7/5054197315893.jpg/600x600bf-60.jpg",
            "songs": [
            "Cracker Island", "Oil", "The Tired Influencer", "Tarantula", "Silent Running", "New Gold", "Baby Queen", "Tormenta", "Skinny Ape", "Possession Island"
            ]
        }
        ]
    },
    {
        "name": "The Strokes",
        "pictureUrl": "https://static01.nyt.com/images/2020/04/16/arts/13strokes-review1/13strokes-review1-videoSixteenByNineJumbo1600.jpg",
        "debutYear": "1998-01-01",
        "genre": "Indie Rock",
        "albums": [
        {
            "title": "Is This It",
            "releaseYear": "2001",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Features115/v4/ea/04/d4/ea04d45d-6f5d-ede6-fb64-71f3e6a6e62f/dj.ojkzzidd.jpg/600x600bf-60.jpg",
            "songs": [
            "Is This It", "The Modern Age", "Soma", "Barely Legal", "Someday", "Alone, Together", "Last Nite", "Hard to Explain", "New York City Cops", "Trying Your Luck", "Take It or Leave It"
            ]
        },
        {
            "title": "Room on Fire",
            "releaseYear": "2003",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/f7/e9/2a/f7e92a48-0e20-8286-bbbf-80bd85fbb1af/mzi.gcledsjj.jpg/600x600bf-60.jpg",
            "songs": [
            "What Ever Happened?", "Reptilia", "Automatic Stop", "12:51", "You Talk Way Too Much", "Between Love & Hate", "Meet Me in the Bathroom", "Under Control", "The Way It Is", "The End Has No End", "I Can't Win"
            ]
        },
        {
            "title": "First Impressions of Earth",
            "releaseYear": "2006",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/f4/c4/25/f4c42532-a348-27f5-1521-4783fdc52a55/888880789709.jpg/600x600bf-60.jpg",
            "songs": [
            "You Only Live Once", "Juicebox", "Heart in a Cage", "Razorblade", "On the Other Side", "Vision of Division", "Ask Me Anything", "Electricityscape", "Killing Lies", "Fear of Sleep", "15 Minutes", "Ize of the World", "Evening Sun", "Red Light"
            ]
        },
        {
            "title": "Angles",
            "releaseYear": "2011",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/8a/90/df/8a90dff0-73c6-c483-ab79-6810308414a2/884977195552.jpg/600x600bf-60.jpg",
            "songs": [
            "Machu Picchu", "Under Cover of Darkness", "Two Kinds of Happiness", "You're So Right", "Taken for a Fool", "Games", "Call Me Back", "Gratisfaction", "Metabolism", "Life Is Simple in the Moonlight"
            ]
        },
        {
            "title": "Comedown Machine",
            "releaseYear": "2013",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/9c/ae/7a/9cae7a72-29ed-08aa-1b42-913776bbb6ec/886443855571.jpg/600x600bf-60.jpg",
            "songs": [
            "Tap Out", "All the Time", "One Way Trigger", "Welcome to Japan", "80's Comedown Machine", "50/50", "Slow Animals", "Partners in Crime", "Chances", "Happy Ending", "Call It Fate, Call It Karma"
            ]
        },
        {
            "title": "The New Abnormal",
            "releaseYear": "2020",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/62/a6/ff/62a6ff2a-95c9-5302-31f4-2dcca9e40323/886448281085.jpg/600x600bf-60.jpg",
            "songs": [
            "The Adults Are Talking", "Selfless", "Brooklyn Bridge to Chorus", "Bad Decisions", "Eternal Summer", "At the Door", "Why Are Sundays So Depressing", "Not the Same Anymore", "Ode to the Mets"
            ]
        }
        ]
    },
    {
        "name": "Pink Floyd",
        "pictureUrl": "https://s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2017/08/04161627/Pink-Floyd.jpg",
        "debutYear": "1965-01-01",
        "genre": "Progressive Rock",
        "albums": [
        {
            "title": "The Piper at the Gates of Dawn",
            "releaseYear": "1967",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music69/v4/07/cd/c9/07cdc978-7bc4-08ab-89e5-dab18a42b863/886445635799.jpg/600x600bf-60.jpg",
            "songs": [
            "Astronomy Domine", "Lucifer Sam", "Matilda Mother", "Flaming", "Pow R. Toc H.", "Take Up Thy Stethoscope and Walk", "Interstellar Overdrive", "The Gnome", "Chapter 24", "Scarecrow", "Bike"
            ]
        },
        {
            "title": "A Saucerful of Secrets",
            "releaseYear": "1968",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/93/89/68/93896876-df27-4e92-3a31-47113d060d1c/886445635881.jpg/600x600bf-60.jpg",
            "songs": [
            "Let There Be More Light", "Remember a Day", "Set the Controls for the Heart of the Sun", "Corporal Clegg", "A Saucerful of Secrets", "See-Saw", "Jugband Blues"
            ]
        },
        {
            "title": "Ummagumma",
            "releaseYear": "1969",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music2/v4/05/93/6d/05936d1f-5476-d791-438f-9b3573fd2bee/886445635812.jpg/600x600bf-60.jpg",
            "songs": [
            "Astronomy Domine", "Careful with That Axe, Eugene", "Set the Controls for the Heart of the Sun", "A Saucerful of Secrets", "Sysyphus", "Grantchester Meadows", "Several Species of Small Furry Animals Gathered Together in a Cave and Grooving with a Pict", "The Narrow Way", "The Grand Vizier's Garden Party"
            ]
        },
        {
            "title": "Atom Heart Mother",
            "releaseYear": "1970",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music49/v4/ac/00/35/ac0035b1-2f21-4a15-9746-646354c811c2/886445635836.jpg/600x600bf-60.jpg",
            "songs": [
            "Atom Heart Mother", "If", "Summer '68", "Fat Old Sun", "Alan's Psychedelic Breakfast"
            ]
        },
        {
            "title": "Meddle",
            "releaseYear": "1971",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music69/v4/ff/14/d5/ff14d50a-af6d-22d5-185a-6247bc008772/886445635911.jpg/600x600bf-60.jpg",
            "songs": [
            "One of These Days", "A Pillow of Winds", "Fearless", "San Tropez", "Seamus", "Echoes"
            ]
        },
        {
            "title": "The Dark Side of the Moon",
            "releaseYear": "1973",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/3c/1b/a9/3c1ba9e1-15b1-03b3-3bfd-09dbd9f1705b/dj.mggvbaou.jpg/600x600bf-60.jpg",
            "songs": [
            "Speak to Me", "Breathe", "On the Run", "Time", "The Great Gig in the Sky", "Money", "Us and Them", "Any Colour You Like", "Brain Damage", "Eclipse"
            ]
        },
        {
            "title": "Wish You Were Here",
            "releaseYear": "1975",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/49/ab/fe/49abfef6-0cd9-aa1f-05c3-3eb85d3fe3f5/886445635843.jpg/600x600bf-60.jpg",
            "songs": [
            "Shine On You Crazy Diamond (Parts I-V)", "Welcome to the Machine", "Have a Cigar", "Wish You Were Here", "Shine On You Crazy Diamond (Parts VI-IX)"
            ]
        },
        {
            "title": "Animals",
            "releaseYear": "1977",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/6d/ef/ff/6deffff9-b10f-975a-337d-88ae2ac05cd0/886445635942.jpg/600x600bf-60.jpg",
            "songs": [
            "Pigs on the Wing (Part One)", "Dogs", "Pigs (Three Different Ones)", "Sheep", "Pigs on the Wing (Part Two)"
            ]
        },
        {
            "title": "The Wall",
            "releaseYear": "1979",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/3c/b4/e3/3cb4e3d0-cd77-8f18-7465-d60e6949b435/886445635850.jpg/600x600bf-60.jpg",
            "songs": [
            "In the Flesh?", "The Thin Ice", "Another Brick in the Wall Part 1", "The Happiest Days of Our Lives", "Another Brick in the Wall Part 2", "Mother", "Goodbye Blue Sky", "Empty Spaces", "Young Lust", "One of My Turns", "Don't Leave Me Now", "Another Brick in the Wall Part 3", "Goodbye Cruel World", "Hey You", "Is There Anybody Out There?", "Nobody Home", "Vera", "Bring the Boys Back Home", "Comfortably Numb", "The Show Must Go On", "In the Flesh", "Run Like Hell", "Waiting for the Worms", "Stop", "The Trial", "Outside the Wall"
            ]
        },
        {
            "title": "The Final Cut",
            "releaseYear": "1983",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/4d/1a/a5/4d1aa517-d701-c6cd-5965-0652f5eee7bf/886445635904.jpg/600x600bf-60.jpg",
            "songs": [
            "The Post War Dream", "Your Possible Pasts", "One of the Few", "The Hero's Return", "The Gunner's Dream", "Paranoid Eyes", "Get Your Filthy Hands Off My Desert", "The Fletcher Memorial Home", "Southampton Dock", "The Final Cut", "Not Now John", "Two Suns in the Sunset"
            ]
        },
        {
            "title": "A Momentary Lapse of Reason",
            "releaseYear": "1987",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/63/a2/c9/63a2c91a-0d7f-634d-b672-a38493b9e0ed/886445635935.jpg/600x600bf-60.jpg",
            "songs": [
            "Signs of Life", "Learning to Fly", "The Dogs of War", "One Slip", "On the Turning Away", "Yet Another Movie", "Round and Around", "A New Machine (Part 1)", "Terminal Frost", "A New Machine (Part 2)", "Sorrow"
            ]
        },
        {
            "title": "The Division Bell",
            "releaseYear": "1994",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/63/a2/c9/63a2c91a-0d7f-634d-b672-a38493b9e0ed/886445635935.jpg/600x600bf-60.jpg",
            "songs": [
            "Cluster One", "What Do You Want from Me", "Poles Apart", "Marooned", "A Great Day for Freedom", "Wearing the Inside Out", "Take It Back", "Coming Back to Life", "Keep Talking", "Lost for Words", "High Hopes"
            ]
        },
        {
            "title": "The Endless River",
            "releaseYear": "2014",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music1/v4/63/32/f8/6332f811-527a-0ec3-e3d8-dc1a997b0e3c/dj.jzdkxzku.jpg/600x600bf-60.jpg",
            "songs": [
            "Things Left Unsaid", "It's What We Do", "Ebb and Flow", "Sum", "Skins", "Unsung", "Anisina", "The Lost Art of Conversation", "On Noodle Street", "Night Light", "Allons-y (1)", "Autumn '68", "Allons-y (2)", "Talkin' Hawkin'", "Calling", "Eyes to Pearls", "Surfacing", "Louder Than Words"
            ]
        }
        ]
    },
    {
        "name": "Olivia Rodrigo",
        "pictureUrl": "https://media.vogue.mx/photos/64fe1ecb17c20cdaa7f206d6/2:3/w_2560%2Cc_limit/olivia-rodrigo-cantante-mexicana.jpg",
        "debutYear": "2020-01-01",
        "genre": "Pop Rock",
        "albums": [
        {
            "title": "SOUR",
            "releaseYear": "2021",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/33/fd/32/33fd32b1-0e43-9b4a-8ed6-19643f23544e/21UMGIM26092.rgb.jpg/600x600bf-60.jpg",
            "songs": [
            "brutal", "traitor", "drivers license", "1 step forward, 3 steps back", "deja vu", "good 4 u", "enough for you", "happier", "jealousy, jealousy", "favorite crime", "hope ur ok"
            ]
        },
        {
            "title": "GUTS",
            "releaseYear": "2023",
            "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/9b/d8/9c/9bd89c9e-b44d-ad25-1516-b9b30f64fd2a/23UMGIM71510.rgb.jpg/600x600bf-60.jpg",
            "songs": [
            "all-american bitch", "bad idea right?", "vampire", "lacy", "ballad of a homeschooled girl", "making the bed", "logical", "get him back!", "love is embarrassing", "the grudge", "pretty isn't pretty", "teenage dream"
            ]
        }
        ]
    }
];

// Ejecutar
print("=== Cargando artistas y álbumes en MongoDB:music ===");
createMultipleArtists(artistsData);