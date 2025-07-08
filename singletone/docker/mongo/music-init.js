db = db.getSiblingDB('music');

// Función para crear un género
function createGenre(name) {
    const genreId = ObjectId();
    db.Genre.insertOne({ _id: genreId, name });
    return genreId;
}

// Función para crear un artista
function createArtist(name, pictureUrl, debutYear) {
    const artistId = ObjectId();
    db.Artist.insertOne({
        _id: artistId,
        name,
        picture_url: pictureUrl,
        debut_year: ISODate(debutYear),
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
            album_id: albumId
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

        const artistId = createArtist(artistData.name, artistData.pictureUrl, artistData.debutYear);

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
        pictureUrl: "https://portalpopline.com.br/wp-content/uploads/2025/05/twenty-one-pilots-breach-novo-album.png",
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
    }
];

// Ejecutar
print("=== Cargando artistas y álbumes en MongoDB:music ===");
createMultipleArtists(artistsData);