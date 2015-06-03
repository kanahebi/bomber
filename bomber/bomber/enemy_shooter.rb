module Bomber
  class EnemyShooter < Bomber::Character
    attr_accessor :guide, :agl
    def initialize(x, y, angle, delay=0)
      super(costume_lists, x, y, angle)
      @agl = :right
      @delay = delay
      @guide = Bomber::Guide.new(self)
      @guide.trace
    end

    def costume_lists
      ["../image/bow.png"]
    end

    def action_list
      [:up, :down, :right, :left]
    end

    def auto
      num = rand(4)
      sleep @delay
      sleep 0.3
      self.send("move_#{action_list[num].to_s}".to_sym)
      sleep 0.2
      self.send("move_#{action_list[num].to_s}".to_sym)
      reject_half
      atack if rand(2) == 0
    end

    def shoot
      arrow = Bomber::Arrow.new(self)
      arrow.on(:start) do
        loop do
          self.shoot
        end
      end
    end

    def atack
      say(message: "エイ！")
      target = next_char(next_block)
      if target
        target.lose
      else
        shoot
      end
      sleep 0.5
      say(message: "")
    end
  end
end