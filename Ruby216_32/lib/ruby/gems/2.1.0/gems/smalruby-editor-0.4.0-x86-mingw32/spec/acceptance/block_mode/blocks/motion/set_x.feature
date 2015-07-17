# encoding: utf-8
# language: ja
@javascript
機能: motion_set_x - 「x座標を(　)にする」ブロック
  シナリオ: ブロックのみ配置する
    前提 "ブロック" タブを表示する

    もし 次のブロックを配置する:
    """
    %block{:type => "motion_set_x", :x => "0", :y => "0"}
      %value{:name => "X"}
        %block{:type => "math_number"}
          %field{:name => "NUM"}<
            10
    """
    かつ ブロックからソースコードを生成する

    ならば テキストエディタのプログラムは "" であること

  シナリオ: キャラクターとブロックを配置する
    前提 "ブロック" タブを表示する
    かつ 次のキャラクターを追加する:
      | name | costumes | x | y | angle |
      | car1 | car1.png | 0 | 0 |     0 |

    もし 次のブロックを配置する:
    """
    %block{:type => "character_new", :x => "21", :y => "15"}
      %field{:name => "NAME"}<
        car1
      %statement{:name => "DO"}
        %block{:type => "motion_set_x", :x => "0", :y => "0"}
          %value{:name => "X"}
            %block{:type => "math_number"}
              %field{:name => "NUM"}<
                10
    """
    かつ ブロックからソースコードを生成する

    ならば テキストエディタのプログラムは以下であること:
    """
    require "smalruby"

    car1 = Character.new(costume: "costume1:car1.png", x: 0, y: 0, angle: 0)
    car1.x = 10

    """

  シナリオ: キャラクターとイベントとブロックを配置する
    前提 "ブロック" タブを表示する
    かつ 次のキャラクターを追加する:
      | name | costumes | x | y | angle |
      | car1 | car1.png | 0 | 0 |     0 |

    もし 次のブロックを配置する:
    """
    %block{:type => "character_new", :x => "21", :y => "15"}
      %field{:name => "NAME"}<
        car1
      %statement{:name => "DO"}
        %block{:type => "events_on_start"}
          %statement{:name => "DO"}
            %block{:type => "motion_set_x", :x => "0", :y => "0"}
              %value{:name => "X"}
                %block{:type => "math_number"}
                  %field{:name => "NUM"}<
                    10
    """
    かつ ブロックからソースコードを生成する

    ならば テキストエディタのプログラムは以下であること:
    """
    require "smalruby"

    car1 = Character.new(costume: "costume1:car1.png", x: 0, y: 0, angle: 0)

    car1.on(:start) do
      self.x = 10
    end

    """
