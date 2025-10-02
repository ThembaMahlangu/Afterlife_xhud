fx_version 'cerulean'
game 'gta5'
lua54 'yes'
use_experimental_fxv2_oal 'yes'

client_scripts {
    'util/client.lua',
    'framework/client/*.lua',
    'modules/*.lua',
    'editable.lua',
    'client.lua',
}

server_scripts {
    'framework/server/*.lua',
}

shared_scripts {
    '@ox_lib/init.lua',
    'shared.lua'
}

escrow_ignore {
    'editable.lua',
    'shared.lua',
    'modules/stress.lua',
    'framework/client/*.lua',
    'framework/server/*.lua',
}

ui_page 'ui/dist/index.html'


data_file 'AUDIO_WAVEPACK' 'audiodirectory'
data_file 'AUDIO_SOUNDDATA' 'data/seatbelt_sounds.dat'


files {
    'ui/dist/index.html',
	'ui/dist/assets/*.js',
    'ui/dist/assets/*.css',
    'ui/dist/assets/*.png',
    'ui/dist/assets/*.otf',
    'ui/dist/assets/*.mp3',
    'audiodirectory/seatbelt_sounds.awc',
    'data/seatbelt_sounds.dat54.rel'
}






