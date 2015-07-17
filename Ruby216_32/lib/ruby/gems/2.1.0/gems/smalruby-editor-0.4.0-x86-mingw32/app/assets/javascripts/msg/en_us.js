goog.provide('Blockly.Msg.en_us.smalruby');

goog.require('Blockly.Msg');


/**
 * Due to the frequency of long strings, the 80-column wrap rule need not apply
 * to message files.
 */

// common
Blockly.Msg.COMMON_TURN_ON = 'turn on';
Blockly.Msg.COMMON_TURN_OFF = 'turn off';
Blockly.Msg.COMMON_FORWARD = 'forward';
Blockly.Msg.COMMON_BACKWARD = 'backward';
Blockly.Msg.COMMON_TURN_LEFT = 'turn left';
Blockly.Msg.COMMON_TURN_RIGHT = 'turn right';
Blockly.Msg.COMMON_STOP = 'stop';
Blockly.Msg.COMMON_ERROR = 'Error';
Blockly.Msg.COMMON_PROCESSING = 'Processing...';


// colour name
Blockly.Msg.COLOUR_RED = 'red';
Blockly.Msg.COLOUR_GREEN = 'green';
Blockly.Msg.COLOUR_BLUE = 'blue';
Blockly.Msg.COLOUR_WHITE = 'white';


// smalruby.js.coffee
Blockly.Msg.SMALRUBY_WILL_DISAPPER_YOUR_PROGRAM = 'Disappear your program!';


// views/main_menu_view.js.coffee
Blockly.Msg.VIEWS_MAIN_MENU_VIEW_COMMON_LINES = ' Lines';
Blockly.Msg.VIEWS_MAIN_MENU_VIEW_COMMON_LETTERS = ' Letters';
Blockly.Msg.VIEWS_MAIN_MENU_VIEW_COMMON_COMMA = ', ';
Blockly.Msg.VIEWS_MAIN_MENU_VIEW_COMMON_CONFIRM_OVERWRITE = 'Are you sure to save?\nBecause you saved as {$filename}, so that will disappear, if you will save!';

Blockly.Msg.VIEWS_MAIN_MENU_VIEW_BLOCK_MODE_BLOCKUI_TITLE = 'Converting Program';
Blockly.Msg.VIEWS_MAIN_MENU_VIEW_BLOCK_MODE_BLOCKUI_MESSAGE = 'Converting your program to instruction blocks.';
Blockly.Msg.VIEWS_MAIN_MENU_VIEW_BLOCK_MODE_ERROR = "Can't convert your program to instruction blocks.";

Blockly.Msg.VIEWS_MAIN_MENU_VIEW_RUN_BLOCKUI_TITLE = 'Running';
Blockly.Msg.VIEWS_MAIN_MENU_VIEW_RUN_BLOCKUI_MESSAGE = "Please switch your program's window.";
Blockly.Msg.VIEWS_MAIN_MENU_VIEW_RUN_BLOCKUI_NOTICE = 'Running your program after save & check it.<br>Press ESC key to quit.';
Blockly.Msg.VIEWS_MAIN_MENU_VIEW_RUN_ERROR_CANT_RUN = "Can't run your program.";
Blockly.Msg.VIEWS_MAIN_MENU_VIEW_RUN_ERROR_CANCEL_TO_RUN = "Cancel to run your program.";

Blockly.Msg.VIEWS_MAIN_MENU_VIEW_DOWNLOAD_BLOCKUI_TITLE = 'Downloading';
Blockly.Msg.VIEWS_MAIN_MENU_VIEW_DOWNLOAD_BLOCKUI_MESSAGE = "Downloading your program.";
Blockly.Msg.VIEWS_MAIN_MENU_VIEW_DOWNLOAD_SUCCEEDED = 'Downloaded.<br>You can run with "ruby {$filename}" on windows or "rsdl {$filename}" on Mac OS X.';
Blockly.Msg.VIEWS_MAIN_MENU_VIEW_DOWNLOAD_ERROR = "Can't download";

Blockly.Msg.VIEWS_MAIN_MENU_VIEW_LOAD_CONFIRM = "Your program will disappear, because you didn't save it! Are you sure to load?";

Blockly.Msg.VIEWS_MAIN_MENU_VIEW_SAVE_ERROR_NO_NAME = 'You must set program name before you save it!';
Blockly.Msg.VIEWS_MAIN_MENU_VIEW_SAVE_BLOCKUI_TITLE = 'Saving your program';
Blockly.Msg.VIEWS_MAIN_MENU_VIEW_SAVE_BLOCKUI_MESSAGE = 'Now, saving your program.';
Blockly.Msg.VIEWS_MAIN_MENU_VIEW_SAVE_BLOCKUI_NOTICE = 'Your program name is "{$filename}".<br>It will be saved at home directory.<br>';
Blockly.Msg.VIEWS_MAIN_MENU_VIEW_SAVE_ERROR_MESSAGE = "Can't save your program.";
Blockly.Msg.VIEWS_MAIN_MENU_VIEW_SAVE_CANCELED = 'Canceled to save.';
Blockly.Msg.VIEWS_MAIN_MENU_VIEW_SAVE_SUCCEEDED = 'Saved.';

Blockly.Msg.VIEWS_MAIN_MENU_VIEW_CHECK_BLOCKUI_TITLE = 'Checking your program';
Blockly.Msg.VIEWS_MAIN_MENU_VIEW_CHECK_BLOCKUI_MESSAGE = 'Now, checking syntax of your program.';
Blockly.Msg.VIEWS_MAIN_MENU_VIEW_CHECK_BLOCKUI_NOTICE = 'This is only checking syntax, so you will find error when you run it.';
Blockly.Msg.VIEWS_MAIN_MENU_VIEW_CHECK_SUCCEEDED = 'Checked.';
Blockly.Msg.VIEWS_MAIN_MENU_VIEW_CHECK_SUCCEEDED_NOTICE = 'Your program was checked only syntax, so you will find error when you run it.';
Blockly.Msg.VIEWS_MAIN_MENU_VIEW_CHECK_ERROR = "Can't check.";

Blockly.Msg.VIEWS_MAIN_MENU_VIEW_SIGNOUT_SUCCEEDED = 'Logouted.';
Blockly.Msg.VIEWS_MAIN_MENU_VIEW_SIGNOUT_ERROR = "Can't logout.";

Blockly.Msg.VIEWS_MAIN_MENU_VIEW_LOAD_ERROR = '{$filename}{$error}';
Blockly.Msg.VIEWS_MAIN_MENU_VIEW_LOAD_SUCCEEDED = 'Loaded.';


// views/load_modal_view.js.coffee
Blockly.Msg.VIEWS_LOAD_MODAL_VIEW_ERROR = "Can't load the program.";


// views/signin_modal_view.js.coffee
Blockly.Msg.VIEWS_SIGNIN_MODAL_VIEW_SIGNED_IN = 'Logged in.';
Blockly.Msg.VIEWS_SIGNIN_MODAL_VIEW_ERROR = "Can't login.";


// blocks/motion.js.coffee.erb
Blockly.Msg.BLOCKS_MOTION_MOVE = 'move %1 steps';
Blockly.Msg.BLOCKS_MOTION_TURN_RIGHT_DEGREES = 'turn right %1 degrees';
Blockly.Msg.BLOCKS_MOTION_TURN_LEFT_DEGREES = 'turn left %1 degrees';
Blockly.Msg.BLOCKS_MOTION_POINT_IN_DIRECTION = 'point in direction %1';
Blockly.Msg.BLOCKS_MOTION_POINT_TOWARDS_MOUSE = 'point towards mouse-pointer';
Blockly.Msg.BLOCKS_MOTION_POINT_TOWARDS_CHARACTER = 'point towards %1';
Blockly.Msg.BLOCKS_MOTION_SET_X_Y = 'go to x: %1 y: %2';
Blockly.Msg.BLOCKS_MOTION_GO_TO_MOUSE = 'go to mouse-pointer';
Blockly.Msg.BLOCKS_MOTION_GO_TO_CHARACTER = 'go to %1';
Blockly.Msg.BLOCKS_MOTION_CHANGE_X_BY = 'change x by %1';
Blockly.Msg.BLOCKS_MOTION_SET_X = 'set x to %1';
Blockly.Msg.BLOCKS_MOTION_CHANGE_Y_BY = 'change y by %1';
Blockly.Msg.BLOCKS_MOTION_SET_Y = 'set y to %1';
Blockly.Msg.BLOCKS_MOTION_TURN_IF_REACH_WALL = 'if reach wall, turn';
Blockly.Msg.BLOCKS_MOTION_TURN = 'turn';
Blockly.Msg.BLOCKS_MOTION_TURN_XY_X = '(x) horizontal';
Blockly.Msg.BLOCKS_MOTION_TURN_XY_Y = '(y) vertical';
Blockly.Msg.BLOCKS_MOTION_TURN_XY = 'turn to %1';
Blockly.Msg.BLOCKS_MOTION_SET_ROTATION_STYLE = 'set rotation style %1';
Blockly.Msg.BLOCKS_MOTION_SET_ROTATION_STYLE_LEFT_RIGHT = 'left-right';
Blockly.Msg.BLOCKS_MOTION_SET_ROTATION_STYLE_NONE = "don't rorate";
Blockly.Msg.BLOCKS_MOTION_SET_ROTATION_STYLE_FREE = 'all around';
Blockly.Msg.BLOCKS_MOTION_SELF_X = 'x position';
Blockly.Msg.BLOCKS_MOTION_SELF_Y = 'y position';
Blockly.Msg.BLOCKS_MOTION_SELF_ANGLE = 'direction';


// blocks/events.js.coffee.erb
Blockly.Msg.BLOCKS_EVENTS_ON_START = 'when Run clicked';
Blockly.Msg.BLOCKS_EVENTS_ON_KEY_PUSH_OR_DOWN = 'when %1 key %2';
Blockly.Msg.BLOCKS_EVENTS_ON_CLICK = 'when this sprite clicked';
Blockly.Msg.BLOCKS_EVENTS_ON_HIT = 'when %1 hit';


// blocks/sensing.js.coffee.erb
Blockly.Msg.BLOCKS_SENSING_K_UP = 'up arrow';
Blockly.Msg.BLOCKS_SENSING_K_DOWN = 'down arrow';
Blockly.Msg.BLOCKS_SENSING_K_LEFT = 'left arrow';
Blockly.Msg.BLOCKS_SENSING_K_RIGHT = 'right arrow';
Blockly.Msg.BLOCKS_SENSING_K_SPACE = 'space';
Blockly.Msg.BLOCKS_SENSING_PRESSED = 'pressed';
Blockly.Msg.BLOCKS_SENSING_PUSH = Blockly.Msg.BLOCKS_SENSING_PRESSED;
Blockly.Msg.BLOCKS_SENSING_DOWN = Blockly.Msg.BLOCKS_SENSING_PRESSED;
Blockly.Msg.BLOCKS_SENSING_HOLD_PRESSED = 'hold pressed';
Blockly.Msg.BLOCKS_SENSING_HOLD_DOWN = Blockly.Msg.BLOCKS_SENSING_HOLD_PRESSED;
Blockly.Msg.BLOCKS_SENSING_M_LBUTTON = 'left-button';
Blockly.Msg.BLOCKS_SENSING_M_MBUTTON = 'middle-button';
Blockly.Msg.BLOCKS_SENSING_M_RBUTTON = 'right-button';
Blockly.Msg.BLOCKS_SENSING_RELEASED = 'released';
Blockly.Msg.BLOCKS_SENSING_UP = Blockly.Msg.BLOCKS_SENSING_RELEASED;
Blockly.Msg.BLOCKS_SENSING_REACH_WALL = 'reach wall?';
Blockly.Msg.BLOCKS_SENSING_INPUT_KEY_PUSH_OR_DOWN_PREFIX = 'key ';
Blockly.Msg.BLOCKS_SENSING_INPUT_KEY_PUSH_OR_DOWN_MIDDLE = ' ';
Blockly.Msg.BLOCKS_SENSING_INPUT_KEY_PUSH_OR_DOWN_SUFFIX = '';
Blockly.Msg.BLOCKS_SENSING_INPUT_MOUSE_PUSH_OR_DOWN_PREFIX = 'mouse ';
Blockly.Msg.BLOCKS_SENSING_INPUT_MOUSE_PUSH_OR_DOWN_MIDDLE = ' ';
Blockly.Msg.BLOCKS_SENSING_INPUT_MOUSE_PUSH_OR_DOWN_SUFFIX = '';
Blockly.Msg.BLOCKS_SENSING_INPUT_MOUSE_POS_X = 'mouse x';
Blockly.Msg.BLOCKS_SENSING_INPUT_MOUSE_POS_Y = 'mouse y';
Blockly.Msg.BLOCKS_SENSING_HIT_PREFIX = 'reach ';
Blockly.Msg.BLOCKS_SENSING_HIT_SUFFIX = '?';
Blockly.Msg.BLOCKS_SENSING_CHARACTER_PROPERTY_X = 'x position';
Blockly.Msg.BLOCKS_SENSING_CHARACTER_PROPERTY_Y = 'y position';
Blockly.Msg.BLOCKS_SENSING_CHARACTER_PROPERTY_ANGLE = 'direction';
Blockly.Msg.BLOCKS_SENSING_CHARACTER_PROPERTY_COSTUME_INDEX = 'costume #';
Blockly.Msg.BLOCKS_SENSING_CHARACTER_PROPERTY_COSTUME = 'contume name';
Blockly.Msg.BLOCKS_SENSING_CHARACTER_PROPERTY_SCALE = 'size';
Blockly.Msg.BLOCKS_SENSING_CHARACTER_PROPERTY_VOLUME = 'volume';
Blockly.Msg.BLOCKS_SENSING_CHARACTER_PROPERTY = '%2 of %1';
Blockly.Msg.BLOCKS_SENSING_TIME_NOW_YEAR = 'year';
Blockly.Msg.BLOCKS_SENSING_TIME_NOW_MONTH = 'month';
Blockly.Msg.BLOCKS_SENSING_TIME_NOW_DAY = 'day';
Blockly.Msg.BLOCKS_SENSING_TIME_NOW_WDAY = 'day of week';
Blockly.Msg.BLOCKS_SENSING_TIME_NOW_HOUR = 'hour';
Blockly.Msg.BLOCKS_SENSING_TIME_NOW_MIN = 'min';
Blockly.Msg.BLOCKS_SENSING_TIME_NOW_SEC = 'sec';
Blockly.Msg.BLOCKS_SENSING_TIME_NOW = 'current ';
Blockly.Msg.BLOCKS_SENSING_DAYS_SINCE_2000 = 'days since 2000';


// blocks/control.js.coffee.erb
Blockly.Msg.BLOCKS_CONTROL_SLEEP = 'wait %1 secs';
Blockly.Msg.BLOCKS_CONTROL_LOOP = 'loop';
Blockly.Msg.BLOCKS_CONTROL_LOOP_END = 'end of loop';
Blockly.Msg.BLOCKS_CONTROL_BREAK = 'stop this loop';
Blockly.Msg.BLOCKS_CONTROL_NEXT = 'next iteration of this loop';
Blockly.Msg.BLOCKS_CONTROL_REDO = 'redo iteration of this loop';
Blockly.Msg.BLOCKS_CONTROL_IF = 'if ';
Blockly.Msg.BLOCKS_CONTROL_THEN = ' then';
Blockly.Msg.BLOCKS_CONTROL_ELSE = 'else';
Blockly.Msg.BLOCKS_CONTROL_TIMES = 'repeat %1';
Blockly.Msg.BLOCKS_CONTROL_AWAIT_UNTIL = 'wait until %1';
Blockly.Msg.BLOCKS_CONTROL_UNTIL = 'repeat until %1';
Blockly.Msg.BLOCKS_CONTROL_AWAIT = 'just wait a little';


// blocks/ruby.js.coffee.erb
Blockly.Msg.BLOCKS_RUBY_STATEMENT = 'statement ';
Blockly.Msg.BLOCKS_RUBY_EXPRESSION = 'expression ';
Blockly.Msg.BLOCKS_RUBY_COMMENT = 'comment ';
Blockly.Msg.BLOCKS_RUBY_P = 'p %1';


// blocks/field_character.js.coffee.erb
Blockly.Msg.BLOCKS_FIELD_CHARACTER_NO_CHARACTER = 'no character';
Blockly.Msg.BLOCKS_FIELD_CHARACTER_FIRST_COSTUME = 'first costume';


// blocks/sound.js.coffee.erb
Blockly.Msg.BLOCKS_SOUND_PRESET_SOUNDS = '%1';
Blockly.Msg.BLOCKS_SOUND_PRESET_SOUNDS_PIANO_DO = 'Middle C of piano';
Blockly.Msg.BLOCKS_SOUND_PRESET_SOUNDS_PIANO_RE = 'D of piano';
Blockly.Msg.BLOCKS_SOUND_PRESET_SOUNDS_PIANO_MI = 'E of piano';
Blockly.Msg.BLOCKS_SOUND_PRESET_SOUNDS_PIANO_FA = 'F of piano';
Blockly.Msg.BLOCKS_SOUND_PRESET_SOUNDS_PIANO_SO = 'G of piano';
Blockly.Msg.BLOCKS_SOUND_PRESET_SOUNDS_PIANO_RA = 'A of piano';
Blockly.Msg.BLOCKS_SOUND_PRESET_SOUNDS_PIANO_SI = 'B of piano';
Blockly.Msg.BLOCKS_SOUND_PRESET_SOUNDS_PIANO_DO_2 = 'High C of piano';
Blockly.Msg.BLOCKS_SOUND_PLAY = 'play sound %1';


// blocks/looks.js.coffee.erb
Blockly.Msg.BLOCKS_LOOKS_SAY = 'say %1';
Blockly.Msg.BLOCKS_LOOKS_THINK = 'think %1';
Blockly.Msg.BLOCKS_LOOKS_SAY_WITH_SECOND = 'say %1 for %2 secs';
Blockly.Msg.BLOCKS_LOOKS_THINK_WITH_SECOND = 'think %1 for %2 secs';
Blockly.Msg.BLOCKS_LOOKS_SHOW = 'show';
Blockly.Msg.BLOCKS_LOOKS_HIDE = 'hide';
Blockly.Msg.BLOCKS_LOOKS_VANISH = 'vanish';
Blockly.Msg.BLOCKS_LOOKS_NEXT_COSTUME = 'next costume';
Blockly.Msg.BLOCKS_LOOKS_SWITCH_COSTUME = 'switch costume to %1';


// blocks/hardware.js.coffee.erb
Blockly.Msg.BLOCKS_HARDWARE_LED_TURN_ON = 'turn on LED %1';
Blockly.Msg.BLOCKS_HARDWARE_LED_TURN_OFF = 'turn off LED %1';
Blockly.Msg.BLOCKS_HARDWARE_ANODE = 'anode';
Blockly.Msg.BLOCKS_HARDWARE_CATHODE = 'cathode';
Blockly.Msg.BLOCKS_HARDWARE_LEFT = 'left';
Blockly.Msg.BLOCKS_HARDWARE_RIGHT = 'right';
Blockly.Msg.BLOCKS_HARDWARE_INIT_HARDWARE = 'setup hardware';
Blockly.Msg.BLOCKS_HARDWARE_NEO_PIXEL_SET_RGB = 'Adfruit NeoPixel RGB LED %1 set color to red %2 green %3 blue %4';
Blockly.Msg.BLOCKS_HARDWARE_RGB_LED_SET_COLOR = 'set RGB LED %1 common %2 color to %3';
Blockly.Msg.BLOCKS_HARDWARE_RGB_LED_TURN_OFF = 'turn off RGB LED %1 common %2';
Blockly.Msg.BLOCKS_HARDWARE_SEVEN_SEGMENT_DISPLAY_SHOW = 'show 7 segment display %1';
Blockly.Msg.BLOCKS_HARDWARE_SEVEN_SEGMENT_DISPLAY_OFF = 'turn off 7 segment display';
Blockly.Msg.BLOCKS_HARDWARE_LCD_PUTS = 'display %1 on the LCD';
Blockly.Msg.BLOCKS_HARDWARE_LCD_CLEAR = 'clear LCD';
Blockly.Msg.BLOCKS_HARDWARE_SERVO_SET_POSITION = 'servo motor %1 set %2 degree (5-180)';
Blockly.Msg.BLOCKS_HARDWARE_TWO_WHEEL_DRIVE_CAR_COMMANDS = '%1';
Blockly.Msg.BLOCKS_HARDWARE_TWO_WHEEL_DRIVE_CAR_FORWARD = 'forward 2WD car %1';
Blockly.Msg.BLOCKS_HARDWARE_TWO_WHEEL_DRIVE_CAR_BACKWARD = 'backward 2WD car %1';
Blockly.Msg.BLOCKS_HARDWARE_TWO_WHEEL_DRIVE_CAR_TURN_LEFT = 'turn left 2WD car %1';
Blockly.Msg.BLOCKS_HARDWARE_TWO_WHEEL_DRIVE_CAR_TURN_RIGHT = 'turn right 2WD car %1';
Blockly.Msg.BLOCKS_HARDWARE_TWO_WHEEL_DRIVE_CAR_STOP = 'stop 2WD car %1';
Blockly.Msg.BLOCKS_HARDWARE_TWO_WHEEL_DRIVE_CAR_RUN = '%1 2WD car %2 %3 secs';
Blockly.Msg.BLOCKS_HARDWARE_TWO_WHEEL_DRIVE_CAR_COMMANDS_FORWARD = 'forward';
Blockly.Msg.BLOCKS_HARDWARE_TWO_WHEEL_DRIVE_CAR_COMMANDS_BACKWARD = 'backward';
Blockly.Msg.BLOCKS_HARDWARE_TWO_WHEEL_DRIVE_CAR_COMMANDS_TURN_LEFT = 'turn left';
Blockly.Msg.BLOCKS_HARDWARE_TWO_WHEEL_DRIVE_CAR_COMMANDS_TURN_RIGHT = 'turn right';
Blockly.Msg.BLOCKS_HARDWARE_TWO_WHEEL_DRIVE_CAR_COMMANDS_STOP = 'stop';
Blockly.Msg.BLOCKS_HARDWARE_TWO_WHEEL_DRIVE_CAR_SET_SPEED = "set 2WD car %1 's %2 motor speed to %3 %";
Blockly.Msg.BLOCKS_HARDWARE_TWO_WHEEL_DRIVE_CAR_SPEED = "2WD car %1 's %2 motor speed (%)";
Blockly.Msg.BLOCKS_HARDWARE_MOTOR_DRIVER_FORWARD = 'forward';
Blockly.Msg.BLOCKS_HARDWARE_MOTOR_DRIVER_BACKWARD = 'backward';
Blockly.Msg.BLOCKS_HARDWARE_MOTOR_DRIVER_STOP = 'stop';
Blockly.Msg.BLOCKS_HARDWARE_MOTOR_DRIVER = "%2 (motor driver %1's) motor";
Blockly.Msg.BLOCKS_HARDWARE_MOTOR_DRIVER_SET_SPEED = "set (motor driver %1's) motor speed to %2 %";
Blockly.Msg.BLOCKS_HARDWARE_MOTOR_DRIVER_SPEED = "(motor driver %1's) motor speed (%)";
Blockly.Msg.BLOCKS_HARDWARE_BUTTON_PRESSED_OR_RELEASED = 'button %1 %2 ?';
Blockly.Msg.BLOCKS_HARDWARE_SENSOR_VALUE = 'sensor %1 value';

Blockly.Msg.BLOCKS_HARDWARE_SMALRUBOT_V3_LED_TURN_ON_OR_OFF = '%2 Smalrubot v3 %1 LED';
Blockly.Msg.BLOCKS_HARDWARE_SMALRUBOT_V3_ACTION = '%1 Smalrubot v3';
Blockly.Msg.BLOCKS_HARDWARE_SMALRUBOT_V3_ACTION_WITH_SEC = '%1 Smalrubot v3 for %2 secs';
Blockly.Msg.BLOCKS_HARDWARE_SMALRUBOT_V3_SENSOR_VALUE = 'Smalrubot v3 %1 sensor';
Blockly.Msg.BLOCKS_HARDWARE_SMALRUBOT_V3_DC_MOTOR_POWER_RATIO = 'Smalrubot v3 %1 dc motor power ratio';
Blockly.Msg.BLOCKS_HARDWARE_SMALRUBOT_V3_DC_MOTOR_SET_POWER_RATIO = 'set Smalrubot v3 %1 dc motor power ratio to %2 %';
Blockly.Msg.BLOCKS_HARDWARE_SMALRUBOT_S1_LED_TURN_ON_OR_OFF = '%2 Smalrubot s1 %1 LED';
Blockly.Msg.BLOCKS_HARDWARE_SMALRUBOT_S1_ACTION = '%1 Smalrubot s1';
Blockly.Msg.BLOCKS_HARDWARE_SMALRUBOT_S1_ACTION_WITH_SEC = '%1 Smalrubot s1 for %2 secs';
Blockly.Msg.BLOCKS_HARDWARE_SMALRUBOT_S1_SENSOR_VALUE = 'Smalrubot s1 %1 sensor';
Blockly.Msg.BLOCKS_HARDWARE_SMALRUBOT_S1_DC_MOTOR_POWER_RATIO = 'Smalrubot s1 %1 dc motor power ratio';
Blockly.Msg.BLOCKS_HARDWARE_SMALRUBOT_S1_DC_MOTOR_SET_POWER_RATIO = 'set Smalrubot s1 %1 dc motor power ratio to %2 %';


// blocks/operators.js.coffee.erb
Blockly.Msg.BLOCKS_OPERATORS_ADD = '%1 + %2';
Blockly.Msg.BLOCKS_OPERATORS_MINUS = '%1 - %2';
Blockly.Msg.BLOCKS_OPERATORS_MULTIPLY = '%1 * %2';
Blockly.Msg.BLOCKS_OPERATORS_DIVIDE = '%1 / %2';
Blockly.Msg.BLOCKS_OPERATORS_COMPARE_LT = '%1 < %2';
Blockly.Msg.BLOCKS_OPERATORS_COMPARE_LTE = '%1 <= %2';
Blockly.Msg.BLOCKS_OPERATORS_COMPARE_EQ = '%1 = %2';
Blockly.Msg.BLOCKS_OPERATORS_COMPARE_GTE = '%1 >= %2';
Blockly.Msg.BLOCKS_OPERATORS_COMPARE_GT = '%1 > %2';
Blockly.Msg.BLOCKS_OPERATORS_RAND = 'pick random %1 to %2';
Blockly.Msg.BLOCKS_OPERATORS_AND = '%1 and %2';
Blockly.Msg.BLOCKS_OPERATORS_OR = '%1 or %2';
Blockly.Msg.BLOCKS_OPERATORS_NOT = 'not %1';
Blockly.Msg.BLOCKS_OPERATORS_INDEX_OF = 'letter %1 of %2';
Blockly.Msg.BLOCKS_OPERATORS_LENGTH = 'length of %1';
Blockly.Msg.BLOCKS_OPERATORS_MODULO = '%1 mod %2';
Blockly.Msg.BLOCKS_OPERATORS_ROUND = 'round %1';
Blockly.Msg.BLOCKS_OPERATORS_MATH_METHOD = '%1 of %2';
Blockly.Msg.BLOCKS_OPERATORS_MATH_METHOD_ABS = 'abs';
Blockly.Msg.BLOCKS_OPERATORS_MATH_METHOD_FLOOR = 'floor';
Blockly.Msg.BLOCKS_OPERATORS_MATH_METHOD_CEIL = 'ceiling';
Blockly.Msg.BLOCKS_OPERATORS_MATH_METHOD_SQRT = 'sqrt';
Blockly.Msg.BLOCKS_OPERATORS_MATH_METHOD_SIN = 'sin';
Blockly.Msg.BLOCKS_OPERATORS_MATH_METHOD_COS = 'cos';
Blockly.Msg.BLOCKS_OPERATORS_MATH_METHOD_TAN = 'tan';
Blockly.Msg.BLOCKS_OPERATORS_MATH_METHOD_ASIN = 'asin';
Blockly.Msg.BLOCKS_OPERATORS_MATH_METHOD_ACOS = 'acos';
Blockly.Msg.BLOCKS_OPERATORS_MATH_METHOD_ATAN = 'atan';
Blockly.Msg.BLOCKS_OPERATORS_MATH_METHOD_LN = 'ln';
Blockly.Msg.BLOCKS_OPERATORS_MATH_METHOD_LOG = 'log';
Blockly.Msg.BLOCKS_OPERATORS_MATH_METHOD_E_SQUARE = 'e ^';
Blockly.Msg.BLOCKS_OPERATORS_MATH_METHOD_10_SQUARE = '10 ^';
Blockly.Msg.BLOCKS_OPERATORS_TRUE = 'true';
Blockly.Msg.BLOCKS_OPERATORS_FALSE = 'false';


// blocks/pen.js.coffee.erb
Blockly.Msg.BLOCKS_PEN_DOWN_PEN = 'pen down';
Blockly.Msg.BLOCKS_PEN_UP_PEN = 'pen up';
Blockly.Msg.BLOCKS_PEN_SET_PEN_COLOR = 'set pen color to %1';
