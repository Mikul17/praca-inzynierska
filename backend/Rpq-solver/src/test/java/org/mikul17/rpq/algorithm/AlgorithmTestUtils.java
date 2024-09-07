package org.mikul17.rpq.algorithm;

import org.mikul17.rpq.algorithms.common.Task;

import java.util.List;

public class AlgorithmTestUtils {

    static final int firstTestCaseBestCmax = 13862;
    static final int firstTestCaseWorstCmax = 25994;
    static final int firstTestCaseAcceptableCmax = 15000;

    static final int secondTestCaseBestCmax = 20917;
    static final int secondTestCaseWorstCmax = 33465;
    static final int secondTestCaseAcceptableCmax = 23000;

    static final int thirdTestCaseBestCmax = 31343;
    static final int thirdTestCaseWorstCmax = 57403;
    static final int thirdTestCaseAcceptableCmax = 38000;

    static final int fourthTestCaseBestCmax = 33878;
    static final int fourthTestCaseWorstCmax = 51444;
    static final int fourthTestCaseAcceptableCmax = 40000;

    static final List<Task> firstTestCase = List.of(
            new Task(1, 8354, 1, 5507),
            new Task(2, 8455, 696, 512),
            new Task(3, 2900, 435, 8619),
            new Task(4, 6176, 424, 3688),
            new Task(5, 586, 971, 76),
            new Task(6, 7751, 134, 5877),
            new Task(7, 7935, 516, 3017),
            new Task(8, 5957, 266, 5540),
            new Task(9, 68, 275, 4040),
            new Task(10, 1688, 308, 2907),
            new Task(11, 436, 171, 2963),
            new Task(12, 5683, 412, 6456),
            new Task(13, 3066, 14, 3960),
            new Task(14, 5104, 792, 5696),
            new Task(15, 8200, 258, 1170),
            new Task(16, 8731, 726, 3081),
            new Task(17, 5017, 912, 5131),
            new Task(18, 84, 124, 3846),
            new Task(19, 8355, 473, 1100),
            new Task(20, 1541, 306, 6302),
            new Task(21, 1808, 20, 5363),
            new Task(22, 114, 874, 5494),
            new Task(23, 3815, 472, 759),
            new Task(24, 2734, 482, 7478)
    );

    static final List<Task> secondTestCase = List.of(
            new Task(1, 0, 831, 0),
            new Task (2, 0 ,867, 0),
            new Task (3, 0, 814, 0),
            new Task (4, 0, 915, 0),
            new Task (5, 0, 947, 0),
            new Task (6, 0, 997, 0),
            new Task (7, 0, 826, 0),
            new Task (8, 0, 966, 0),
            new Task (9, 0, 946, 0),
            new Task (10, 0, 871, 0),
            new Task (11, 0, 894, 0),
            new Task (12, 0, 989, 0),
            new Task (13, 0, 910, 0),
            new Task (14, 0, 851, 0),
            new Task (15, 0, 852, 0),
            new Task (16, 0, 931, 0),
            new Task (17, 0, 863, 0),
            new Task (18, 0, 822, 0),
            new Task (19, 0, 982, 0),
            new Task (20, 0, 926, 0),
            new Task (21, 0, 993, 0),
            new Task (22, 0, 945, 0),
            new Task (23, 0, 978, 0),
            new Task (24, 8368, 1, 12548)
    );

    static final List<Task> thirdTestCase = List.of(
            new Task(1, 15808, 838, 11659),
            new Task(2, 11731, 470, 14049),
            new Task(3, 8933, 177, 8647),
            new Task(4, 15165, 472, 4137),
            new Task(5, 10164, 732, 13213),
            new Task(6, 9520, 768, 2848),
            new Task(7, 13481, 895, 11629),
            new Task(8, 16681, 524, 13649),
            new Task(9, 237, 811, 15392),
            new Task(10, 360, 890, 1967),
            new Task(11, 15796, 746, 13667),
            new Task(12, 2136, 278, 16456),
            new Task(13, 8538, 901, 4775),
            new Task(14, 6024, 810, 11081),
            new Task(15, 2585, 401, 828),
            new Task(16, 7363, 446, 10186),
            new Task(17, 10646, 283, 2371),
            new Task(18, 12951, 89, 4913),
            new Task(19, 5838, 890, 14786),
            new Task(20, 14342, 581, 4353),
            new Task(21, 9183, 755, 15985),
            new Task(22, 1779, 78, 17029),
            new Task(23, 14311, 915, 15371),
            new Task(24, 16625, 631, 13507),
            new Task(25, 4447, 820, 6351),
            new Task(26, 3713, 602, 13893),
            new Task(27, 14087, 80, 10919),
            new Task(28, 8794, 339, 8833),
            new Task(29, 1340, 950, 8731),
            new Task(30, 796, 225, 6267),
            new Task(31, 7073, 475, 16773),
            new Task(32, 9661, 910, 6338),
            new Task(33, 2954, 862, 14425),
            new Task(34, 10270, 529, 9684),
            new Task(35, 2394, 869, 12045),
            new Task(36, 4633, 55, 2210),
            new Task(37, 6519, 455, 1497),
            new Task(38, 10455, 200, 12583),
            new Task(39, 10056, 886, 6003),
            new Task(40, 13293, 476, 16248),
            new Task(41, 10386, 275, 16512),
            new Task(42, 982, 51, 579),
            new Task(43, 7028, 674, 3541),
            new Task(44, 468, 446, 887),
            new Task(45, 13872, 375, 16660),
            new Task(46, 10637, 324, 11792),
            new Task(47, 2168, 347, 1592),
            new Task(48, 849, 550, 5221)
    );

    static final List<Task> fourthTestCase = List.of(
            new Task(1, 11677, 544, 2607),
            new Task(2, 8548, 616, 5612),
            new Task(3, 16383, 259, 3807),
            new Task(4, 9028, 124, 14310),
            new Task(5, 16337, 642, 10526),
            new Task(6, 5655, 873, 13648),
            new Task(7, 2756, 162, 7089),
            new Task(8, 2365, 527, 3206),
            new Task(9, 10868, 836, 2817),
            new Task(10, 6086, 300, 8692),
            new Task(11, 16651, 875, 1550),
            new Task(12, 2356, 542, 15443),
            new Task(13, 9581, 970, 17113),
            new Task(14, 14007, 898, 14057),
            new Task(15, 4695, 720, 14801),
            new Task(16, 7391, 387, 4611),
            new Task(17, 1180, 321, 7311),
            new Task(18, 16868, 922, 16055),
            new Task(19, 899, 136, 9421),
            new Task(20, 1255, 630, 5519),
            new Task(21, 1363, 166, 17011),
            new Task(22, 11196, 604, 5447),
            new Task(23, 3298, 743, 9029),
            new Task(24, 4336, 274, 11206),
            new Task(25, 2225, 611, 8642),
            new Task(26, 7696, 421, 7240),
            new Task(27, 5801, 512, 7569),
            new Task(28, 7739, 577, 2521),
            new Task(29, 2318, 959, 3608),
            new Task(30, 9952, 280, 14196),
            new Task(31, 7748, 592, 873),
            new Task(32, 6242, 642, 5133),
            new Task(33, 11292, 481, 14653),
            new Task(34, 16817, 259, 15829),
            new Task(35, 12313, 191, 3968),
            new Task(36, 8414, 16, 13600),
            new Task(37, 502, 350, 17206),
            new Task(38, 16484, 25, 1261),
            new Task(39, 15749, 289, 14335),
            new Task(40, 16075, 309, 8495),
            new Task(41, 2117, 626, 12438),
            new Task(42, 9434, 99, 2360),
            new Task(43, 5618, 426, 10292),
            new Task(44, 15660, 303, 6816),
            new Task(45, 1021, 121, 7862),
            new Task(46, 7004, 857, 12068),
            new Task(47, 9750, 768, 13436),
            new Task(48, 5673, 203, 9138)
    );

}
