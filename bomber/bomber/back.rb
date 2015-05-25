module Bomber
  class Back < Bomber::Character
    def initialize
      super("../image/config_back.png", 0, 0, 0)
    end

    def put_block
      if Input.mouse_push?(M_LBUTTON)
          puts $blocks.size
        unless block_exists?
          $blocks << block = Bomber::Block.new(clicked_block)
          block.on(:start) do
            on(:click) do
              add_event
            end
          end
        end
        puts $blocks.size
        puts clicked_block
      end
    end

    def block_exists?
      $blocks.map{|block| block.current_block}.include?(clicked_block)
    end

    def yaml_dump
      a=$blocks.map do |block|
        unless col = block.col
          col = block.collar_lists[block.costume_index]
        end
        {'x' => block.current_x_block,
         'y' => block.current_y_block,
         'col' => col}
      end
      puts a
      open("./config.yml","w") do |f|
        YAML.dump(a,f)
      end
    end
  end
end