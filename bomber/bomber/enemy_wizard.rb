module Bomber
  class EnemyWizard < Bomber::Character
    attr_accessor :guide, :agl
    def initialize(x, y, angle, delay=0)
      super(costume_lists, x, y, angle)
      @agl = :right
      @delay = delay
      @guide = Bomber::Guide.new(self)
      @guide.trace
    end

    def costume_lists
      ["../image/wiz.png"]
    end

    def action_list
      [:up, :down, :right, :left]
    end

    def block_list
      ["stone", "brick", "wood"]
    end

    def auto
      generate_block
    end

    def generate_block
      num = rand(4)
      sleep @delay
      sleep 0.3
      self.send("move_#{action_list[num].to_s}".to_sym)
      sleep 0.2
      self.send("move_#{action_list[num].to_s}".to_sym)
      reject_half
      atack if rand(7) == 0
    end

    def atack
      if next_char(next_block, true)
        super
      else
        say(message: "エイ！")
        num = rand(4)
        if num < 3
          obj = Bomber::Block.new("x" => next_block[0], "y" => next_block[1], "col" => block_list[num])
          $blocks << obj
        else
          obj = Bomber::Door.new(*next_block, self.agl)
        end
        $hit_obj << obj
        $all_obj << obj
        sleep 0.5
        say(message: "")
      end
    end
  end
end