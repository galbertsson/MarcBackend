package helpers;

import com.example.model.Deck;
import lombok.Getter;

public class SimplifiedDeckView {
    @Getter
    private Long id;

    @Getter
    private String title;

    public SimplifiedDeckView(Deck deck){
        id = deck.getId();
        title = deck.getTitle();
    }
}
