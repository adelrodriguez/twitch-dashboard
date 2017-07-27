$(document).ready(function() {
	var twitch = {
		api: 'https://wind-bow.glitch.me/twitch-api/',
		routes: {
			channels: '/channels/',
			streams: '/streams/'
		},
		users: ['freeCodeCamp', 'squillakilla', 'pokemon', 'playhearthstone', 'ign', 'ESL_SC2',
				'omgitsfirefoxx', 'kindafunnygames', 'manvsgame', 'trihex', 'nightblue3', 'kittyplays',
				'teamsp00ky', 'bobross', 'maximilian_dood', 'angryjoeshow', 'tangent'
				]
		};

	init();

	function init() {
		twitch.users.forEach(function(user) {
			retrieveData(user, twitch.routes.streams);
		});

		$("input:checkbox").change(function() {
			$(".offline").toggleClass("no-show");
		});
	}

	function retrieveData(user, route) {
		var url = twitch.api + route + user;
		var stream = {};

		$.getJSON(url, function (data) {
			if (data.stream) {
				stream = {
					isLive: true,
					game: data.stream.game,
					preview: data.stream.preview.medium,
					viewers: data.stream.viewers
				}
				addChannel(data.stream.channel, stream)
			} else if (route === twitch.routes.channels) {
				stream = {
					isLive: false
				}
				addChannel(data, stream);
			} else {
				retrieveData(user, twitch.routes.channels);
			}
		});
	}

	function addChannel(data, stream) {
		var channel = new Channel(data, stream);
		displayData(channel);
	}

	function Channel(data, stream) {
		this.name = data.display_name;
		this.status = data.status;
		this.logo = data.logo;
		this.url = data.url;
		this.online = stream.isLive;
		this.game = data.game;

		if(stream.isLive) {
			this.preview = stream.preview;
			this.viewers = stream.viewers;
		}
	}

	function displayData(channel) {
		var card = 	'<div class="ui fluid card ' + (channel.online ? '': 'offline') + '">' +
						'<a class="image" href="' + channel.url + '" target="_blank">' +
							'<img src="' + (channel.online ? channel.preview + '" >' : '" style="display: none">')  +
						'</a>' +
						'<div class="content">' +
						'<img class="avatar right floated ui image" src="' + channel.logo + '">' +
							'<a class="header username" href="' + channel.url + '" target="_blank">' + channel.name + '</a>' +
							'<div class="meta">' +
								'<a href="' + channel.url + '" target="_blank">' + (channel.online ? 'ONLINE <i class="user icon"></i>' + channel.viewers + ' viewers' : 'OFFLINE') + '</a>' +
							'</div>' +
							'<div class="description">' +
								channel.status +
							'</div>' +
						'</div>' +
						'<div class="extra content">' +
							'<a>' + '<i class="twitch icon"></i> ' + (channel.online ? 'Playing ' + channel.game : '') + '</a>' +
						'</div>' + 
					'</div>';
		
		$(card).appendTo("#streamers"); 
	}
});