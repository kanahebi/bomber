# -*- coding: utf-8 -*-
module RubyToBlock
  module Block
    class MotionChangeYBy < CharacterMethodCall
      blocknize '^\s*' + CHAR_RE + 'y\s*\+=\s*(\S+)\s*$',
                statement: true, inline: true

      def self.process_match_data(md, context)
        md2 = regexp.match(md[type])

        block = new
        _, context.current_block =
          *add_child_or_create_character_new_block(context, md2[1], block)
        process_value_string(context, block, md2[2], 'Y')

        true
      end
    end
  end
end
