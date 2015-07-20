module Bomber
  class EnemyHammer < Bomber::Character
    attr_accessor :guide, :agl
    def initialize(x, y, angle, delay=0)
      super(costume_lists, x, y, angle)
      @agl = :right
      @delay = delay
      @guide = Bomber::Guide.new(self)
      @guide.trace
    end

    def costume_lists
      ["../image/hun.png"]
    end

    def action_list
      [:up, :down, :right, :left]
    end

    def block_list
      ["stone", "brick", "wood"]
    end

    def auto
      super
      break_block
    end

    def break_block
      num = rand(4)
      sleep @delay
      sleep 0.3
      self.send("move_#{action_list[num].to_s}".to_sym)
      sleep 0.2
      self.send("move_#{action_list[num].to_s}".to_sym)
      reject_half
      atack if rand(4) == 0
    end

    def atack
      target = next_char(next_block, true)
      return unless target
      if target.class == Bomber::Block or target.class == Bomber::Door
        say(message: "エイ！")
        target.destroy
        sleep 0.5
        say(message: "")
      else
        super
      end
    end
  end
end